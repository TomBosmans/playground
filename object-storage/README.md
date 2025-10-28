# Object Storage

A lightweight TypeScript abstraction for managing binary objects (files, images, documents, etc.) in any **S3-compatible object storage** — such as **AWS S3**, **MinIO**, **Wasabi**, or **DigitalOcean Spaces**.

This package provides a consistent interface (`ObjectRepository`) and a concrete implementation (`MinioObjectRepository`) that supports common object storage operations such as uploading, downloading, copying, deleting, and generating presigned URLs.

Because all of these services implement the same **S3 API**, you can seamlessly use **AWS S3 in production** while running **MinIO locally** for development or testing — without changing your application code.
