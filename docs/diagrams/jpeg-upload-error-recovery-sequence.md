
# JPEG Upload (Error Handling and Recovery Sequence Diagram)

This diagram represents Calypso's handling of metadata extraction and database storage failures after an uploaded JPEG has passed validation.

It documents the behavior of `src/DropZone.tsx` and `src/server/server.ts`, including temporary file cleanup, exception handling, and HTTP responses.

```mermaid
sequenceDiagram
    actor User
    participant UI as DropZone (React)
    participant API as Express Upload Handler
    participant FS as Temporary File System
    participant EXIF as EXIFTool
    participant DB as ImageModel (MongoDB)

    User->>UI: Drop JPEG file
    UI->>UI: Validate extension, MIME and file size
    UI->>API: POST /api/images/upload

    Note over API: Server JPEG validation has passed

    API->>FS: writeFileSync(tempFilePath, buffer)
    API->>EXIF: read(tempFilePath)

    alt Metadata extraction fails
        EXIF-->>API: Throws extraction error
        API->>FS: existsSync(tempFilePath)
        FS-->>API: File existence result
        opt Temporary file still exists
            API->>FS: unlinkSync(tempFilePath)
        end
        API-->>UI: HTTP 500 processing error
        UI-->>User: Display upload error
    else Metadata extraction succeeds
        EXIF-->>API: Return EXIF tags
        API->>FS: unlinkSync(tempFilePath)
        API->>API: Parse GPS and construct image record
        API->>DB: newImageRecord.save()

        alt Database save fails
            DB-->>API: Throws storage error
            API-->>UI: HTTP 500 processing error
            UI-->>User: Display upload error
        else Database save succeeds
            DB-->>API: Save completed
            API-->>UI: HTTP 201 and saved image ID
            UI-->>User: Display success message
        end
    end
```

## Implementation Correspondence

| Behavior | Source |
|---|---|
| JPEG file submission and result messages | `src/DropZone.tsx` |
| Server-side validation and exception handling | `src/server/server.ts` |
| Temporary file creation and deletion | Node.js `fs` operations in `server.ts` |
| Metadata extraction | `exiftool.read()` |
| Database persistence | `newImageRecord.save()` |

## Design Considerations

- Validation occurs before temporary file creation.
- A metadata extraction failure prevents database storage.
- Temporary image files are deleted after successful metadata extraction.
- The server's exception handler attempts cleanup if a temporary file still exists.
- A database save failure produces HTTP 500 rather than a success response.
- Successful persistence produces HTTP 201 and returns the saved image ID.

This diagram models existing application behavior. It does not imply that separate error-handling service classes have been implemented.
