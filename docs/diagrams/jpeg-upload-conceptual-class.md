
# JPEG Upload Validation (Conceptual Class Diagram)

This conceptual model describes the JPEG files, stored image records, extracted metadata, and optional GPS information involved in Calypso's image-upload workflow.

The concepts correspond to functionality in `src/DropZone.tsx`, `src/server/server.ts`, and `src/server/models/Image.ts`. They represent domain concepts, not necessarily separate TypeScript classes.

```mermaid
classDiagram
    class JPEGFile {
        +originalName
        +mimeType
        +fileSize
        +binaryData
    }

    class StoredImageRecord {
        +filename
        +originalName
        +contentType
        +fileSize
        +createdAt
    }

    class ExifMetadata {
        +make
        +model
        +dateTimeOriginal
        +iso
        +exposureTime
    }

    class GPSLocation {
        +latitude
        +longitude
        +altitude
    }

    JPEGFile "1" --> "0..1" StoredImageRecord : valid upload becomes
    StoredImageRecord "1" *-- "1" ExifMetadata : stores
    StoredImageRecord "1" o-- "0..1" GPSLocation : may include

    note for JPEGFile "Upload validation checks extension, MIME type, nonempty file, and JPEG header"
```

## Implementation correspondence

- `JPEGFile`: Uploaded file information received by the React frontend and Express server.
- `StoredImageRecord`: The document defined through the MongoDB image model.
- `ExifMetadata`: Information extracted using EXIFTool.
- `GPSLocation`: Optional location information extracted from JPEG metadata.

Invalid uploads are rejected before a stored image record is created.
