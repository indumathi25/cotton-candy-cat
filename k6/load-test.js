import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import encoding from 'k6/encoding';

// ─── Custom Metrics ───────────────────────────────────────────────
const coursesLatency = new Trend('courses_latency', true);
const studentLatency = new Trend('student_latency', true);
const scheduleLatency = new Trend('schedule_latency', true);
const enrollLatency = new Trend('enroll_latency', true);
const errorRate = new Rate('error_rate');

// ─── Config ───────────────────────────────────────────────────────
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const STUDENT_USER = __ENV.STUDENT_USER || 'student';
const STUDENT_PASS = __ENV.STUDENT_PASS || 'password';
const ADMIN_USER = __ENV.ADMIN_USER || 'admin';
const ADMIN_PASS = __ENV.ADMIN_PASS || 'admin';
const STUDENT_ID = __ENV.STUDENT_ID || '101';
const SECTION_ID = __ENV.SECTION_ID || '1';

const studentAuth = `Basic ${__ENV.STUDENT_B64 || encoding.b64encode(`${STUDENT_USER}:${STUDENT_PASS}`)}`;
const adminAuth = `Basic ${__ENV.ADMIN_B64 || encoding.b64encode(`${ADMIN_USER}:${ADMIN_PASS}`)}`;

// ─── Thresholds (SLOs) ────────────────────────────────────────────
export const options = {
    scenarios: {
        // ramping-arrival-rate: ramp-up with precise RPS control
        // 25 iterations/sec × 4 HTTP calls each = ~100 RPS at peak
        load_test: {
            executor: 'ramping-arrival-rate',
            startRate: 0,        // start at 0 iterations/sec
            timeUnit: '1s',
            preAllocatedVUs: 30, // VUs pre-warmed and ready
            maxVUs: 60,          // hard cap on concurrent VUs
            stages: [
                { duration: '3m', target: 25 },  // ramp up   0 → 100 RPS
                { duration: '7m', target: 25 },  // hold at      100 RPS
                { duration: '2m', target: 0 },  // ramp down 100 → 0 RPS
            ],
        },
    },
    thresholds: {
        // Global HTTP thresholds
        http_req_duration: [
            'p(95)<500',   // 95% of requests must complete below 500ms
            'p(99)<1000',  // 99% of requests must complete below 1s
            'avg<300',     // average must be below 300ms
        ],
        // Per-endpoint thresholds
        courses_latency: ['p(95)<400', 'p(99)<800', 'avg<200'],
        student_latency: ['p(95)<400', 'p(99)<800', 'avg<200'],
        schedule_latency: ['p(95)<500', 'p(99)<900', 'avg<250'],
        enroll_latency: ['p(95)<800', 'p(99)<1500', 'avg<400'],
        error_rate: ['rate<0.01'], // <1% error rate
    },
};

// ─── Test Scenarios ───────────────────────────────────────────────
export default function () {
    const headers = { Authorization: studentAuth, 'Content-Type': 'application/json' };

    // 1. Browse courses
    const coursesRes = http.get(`${BASE_URL}/api/courses`, { headers });
    coursesLatency.add(coursesRes.timings.duration);
    const coursesOk = check(coursesRes, {
        'GET /api/courses → 200': (r) => r.status === 200,
        'courses response has content': (r) => r.body.length > 0,
    });
    errorRate.add(!coursesOk);

    sleep(0.5);

    // 2. Get student profile
    const profileRes = http.get(`${BASE_URL}/api/students/${STUDENT_ID}`, { headers });
    studentLatency.add(profileRes.timings.duration);
    const profileOk = check(profileRes, {
        'GET /api/students/:id → 200': (r) => r.status === 200,
    });
    errorRate.add(!profileOk);

    sleep(0.5);

    // 3. Get student schedule
    const scheduleRes = http.get(`${BASE_URL}/api/students/${STUDENT_ID}/schedule`, { headers });
    scheduleLatency.add(scheduleRes.timings.duration);
    const scheduleOk = check(scheduleRes, {
        'GET /api/students/:id/schedule → 200': (r) => r.status === 200,
    });
    errorRate.add(!scheduleOk);

    sleep(0.5);

    // 4. Attempt enrollment (will likely return 400 if already enrolled — that's OK)
    const enrollRes = http.post(
        `${BASE_URL}/api/enrollments`,
        JSON.stringify({ studentId: parseInt(STUDENT_ID), courseSectionId: parseInt(SECTION_ID) }),
        { headers }
    );
    enrollLatency.add(enrollRes.timings.duration);
    const enrollOk = check(enrollRes, {
        'POST /api/enrollments → 200 or 400': (r) => r.status === 200 || r.status === 400,
    });
    errorRate.add(!enrollOk);

    sleep(1);
}
