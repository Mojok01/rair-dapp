resource "vault_mount" "primary" {
  path        = "primary"
  type        = "kv-v2"
  description = "Primary KV secret storage"
}

locals {
  generic_secret_test_sub_path = "test"
}

resource "vault_generic_secret" "test" {
  depends_on = [
    vault_mount.primary
  ]
  path = "${vault_mount.primary.path}/${local.generic_secret_test_sub_path}"

  data_json = <<EOT
{
  "initial-secret": "changeme"
}
EOT
}