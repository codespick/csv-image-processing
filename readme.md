
---

### Readme.md
This file provides detailed API documentation with specifications for endpoints, request/response formats, and examples.

```markdown
# Image Processing System API Documentation

**Base URL**: `https://csv-image-processing.vercel.app/api`  
**Version**: 1.0.0  

This API enables uploading CSV files with image URLs, processing images asynchronously, and checking processing status. All responses are in JSON format.

## Table of Contents
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [1. Upload CSV](#1-upload-csv)
  - [2. Check Status](#2-check-status)
  - [3. Process Images](#3-process-images)
- [Request/Response Formats](#requestresponse-formats)
- [Error Codes](#error-codes)
- [Webhook Integration](#webhook-integration)
- [Example Usage](#example-usage)
- [Database Schema](#database-schema)

## Authentication
No authentication is currently implemented. Consider adding API keys or JWT for production.

## Endpoints

### 1. Upload CSV
Initiate image processing by uploading a CSV file.

- **URL**: `/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - **Body**:
    | Parameter    | Type   | Required | Description                                      |
    |--------------|--------|----------|-------------------------------------------------|
    | `file`    | File   | Yes      | CSV file with S.No., Product Name, Image URLs   |

### 2. Check Status
Retrieve the processing status of a request.

- **URL**: `/status/:requestId`
- **Method**: `GET`
- **Parameters**:
  - **Path**:
    | Parameter   | Type   | Required | Description           |
    |-------------|--------|----------|-----------------------|
    | `requestId` | String | Yes      | Unique request ID     |

- **Success Response**:
  - **Code**: 200 OK
  - **Body** (Pending):
    ```json
    {
      "requestId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "pending"
    }