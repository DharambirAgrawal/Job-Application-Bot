"""
Simple Supabase Storage Helper using boto3
"""

import boto3
from botocore.client import Config
from botocore.exceptions import BotoCoreError, ClientError
import io


class SupabaseStorage:
    def __init__(self, endpoint, bucket, access_key, secret_key, region="us-east-1"):
        """
        Initialize Supabase Storage connection.

        Args:
            endpoint (str): Supabase S3 endpoint (e.g. https://xyz.supabase.co/storage/v1/s3)
            bucket (str): Name of your Supabase Storage bucket
            access_key (str): Supabase service role access key
            secret_key (str): Supabase secret key
            region (str): AWS region (default: us-east-1)
        """
        self.endpoint = endpoint
        self.bucket = bucket
        self.access_key = access_key
        self.secret_key = secret_key
        self.region = region

        self.client = boto3.client(
            "s3",
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            endpoint_url=self.endpoint,
            region_name=self.region,
            config=Config(signature_version="s3v4"),
        )

    def upload_file(self, data, file_name, folder=None):
        """
        Upload a file (bytes or file-like object) to Supabase storage.

        Args:
            data (bytes | file-like): The file data
            file_name (str): The name of the file to upload (e.g. "image.png")
            folder (str, optional): Folder path inside bucket (e.g. "uploads")

        Returns:
            dict: Upload info with bucket and key
        """
        key = f"{folder.strip('/')}/{file_name}" if folder else file_name
        print(key)
        print(file_name)
        print(folder)

        if isinstance(data, bytes):
            payload = io.BytesIO(data)
        else:
            payload = data  # assume file-like object

        try:
            self.client.upload_fileobj(payload, self.bucket, key)
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(f"Failed to upload '{key}' to Supabase: {e}")

        return {
            "bucket": self.bucket,
            "key": key,
        }

    def fetch_file(self, file_name, folder=None):
        """
        Download a file from Supabase storage.

        Args:
            file_name (str): The file name (e.g. "photo.jpg")
            folder (str, optional): Folder path inside bucket

        Returns:
            bytes: File content
        """
        key = f"{folder.strip('/')}/{file_name}" if folder else file_name

        try:
            obj = self.client.get_object(Bucket=self.bucket, Key=key)
            return obj["Body"].read()
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(f"Failed to fetch '{key}' from Supabase: {e}")

    def list_files(self, folder=None):
        """
        List files in the bucket (or a specific folder).

        Args:
            folder (str, optional): Folder name

        Returns:
            list[str]: List of file keys
        """
        prefix = f"{folder.strip('/')}/" if folder else ""
        try:
            response = self.client.list_objects_v2(Bucket=self.bucket, Prefix=prefix)
            contents = response.get("Contents", [])
            return [obj["Key"] for obj in contents]
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(f"Failed to list files in '{self.bucket}': {e}")

    def delete_file(self, file_name, folder=None):
        """
        Delete a file from the bucket.

        Args:
            file_name (str): The file name
            folder (str, optional): Folder path
        """
        key = f"{folder.strip('/')}/{file_name}" if folder else file_name

        try:
            self.client.delete_object(Bucket=self.bucket, Key=key)
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(f"Failed to delete '{key}' from Supabase: {e}")




"""
# Initialize once
storage = SupabaseStorage(
    endpoint="https://your-project-id.supabase.co/storage/v1/s3",
    bucket="my-bucket",
    access_key="your-access-key",
    secret_key="your-secret-key"
)

# Upload a file
with open("photo.png", "rb") as f:
    result = storage.upload_file(f, "photo.png", folder="images")
    print(result)

# Fetch a file
data = storage.fetch_file("photo.png", folder="images")
with open("downloaded_photo.png", "wb") as f:
    f.write(data)

# List files
print(storage.list_files("images"))

# Delete a file
storage.delete_file("photo.png", folder="images")



"""