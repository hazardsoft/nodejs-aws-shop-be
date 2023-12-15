export const enum BucketErrors {
  GET_OBJECT_ERROR = "GetObjectError",
  COPY_OBJECT_ERROR = "CopyObjectError",
  DELETE_OBJECT_ERROR = "DeleteObjectError",
}

export class BucketGetObjectError extends Error {
  constructor() {
    super(BucketErrors.GET_OBJECT_ERROR);
  }
}
export class BucketCopyObjectError extends Error {
  constructor() {
    super(BucketErrors.COPY_OBJECT_ERROR);
  }
}
export class BucketDeleteObjectError extends Error {
  constructor() {
    super(BucketErrors.DELETE_OBJECT_ERROR);
  }
}

export const enum QueueErrors {
  SEND_MESSAGE_ERROR = "SendMessageError",
}

export class SendMessageError extends Error {
  constructor() {
    super(QueueErrors.SEND_MESSAGE_ERROR);
  }
}
