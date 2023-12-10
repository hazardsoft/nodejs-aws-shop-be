import { ProductMessages, RepositoryMessages, TopicMessages } from "./types";

export class ProductNotFoundError extends Error {
  constructor() {
    super(ProductMessages.PRODUCT_NOT_FOUND);
  }
}

export class RepositoryError extends Error {
  constructor() {
    super(RepositoryMessages.INTERNAL_REPOSITORY_ERROR);
  }
}

export class TopicPublishError extends Error {
  constructor() {
    super(TopicMessages.TOPIC_PUBLISH_ERROR);
  }
}
