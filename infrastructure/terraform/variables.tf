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

  validation {
    condition     = length(var.public_key) > 0
    error_message = "public_key must not be empty. Set the EC2_SSH_KEY_PUB GitHub Secret with your public SSH key."
  }
}
