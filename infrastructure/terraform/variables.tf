variable "region" {
  description = "AWS Region"
  default     = "eu-west-1"
}

variable "instance_type" {
  description = "EC2 Instance Type"
  default     = "t3.micro"
}

variable "public_key" {
  description = "Public SSH key content (provided via TF_VAR_public_key in CI)"
  type        = string
}
