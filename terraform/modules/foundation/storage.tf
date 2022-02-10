resource "google_storage_bucket" "rair-files" {
  name          = "rair-files"
  location      = var.region
  force_destroy = true
  project       = var.gcp_project_id
  storage_class = "STANDARD"
}

# This bucket stores the TF State for manually managed, terraform data for Vault clusters
resource "google_storage_bucket" "vault_cluster_tf_admin" {
  name          = "${var.gcp_project_id}-vault-cluster-tf-state"
  location      = var.region
  storage_class = "STANDARD"
}