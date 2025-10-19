interface BaseMessageFields {
  content: string;
  name?: string;
  additional_kwargs?: {
    [key: string]: unknown;
  };
}

export class CustomAIMessageChunk {
  /** The text of the message. */
  content: string;

  /** The name of the message sender in a multi-user chat. */
  name?: string;

  /** Additional keyword arguments */
  additional_kwargs: NonNullable<BaseMessageFields['additional_kwargs']>;

  constructor(fields: BaseMessageFields) {
    // Make sure the default value for additional_kwargs is passed into super() for serialization
    if (!fields.additional_kwargs) {
      fields.additional_kwargs = {};
    }

    this.name = fields.name;
    this.content = fields.content;
    this.additional_kwargs = fields.additional_kwargs;
  }

  static _mergeAdditionalKwargs(
    left: NonNullable<BaseMessageFields['additional_kwargs']>,
    right: NonNullable<BaseMessageFields['additional_kwargs']>,
  ): NonNullable<BaseMessageFields['additional_kwargs']> {
    const merged = { ...left };
    for (const [key, value] of Object.entries(right)) {
      if (value === undefined || value === null) {
        continue; // Skip undefined or null values
      }
      if (merged[key] === undefined || merged[key] === null) {
        merged[key] = value;
      }
      else if (typeof merged[key] === 'string' && typeof value === 'string') {
        merged[key] = (merged[key] as string) + value;
      }
      else if (Array.isArray(merged[key]) && Array.isArray(value)) {
        merged[key] = [...(merged[key] as unknown[]), ...value];
      }
      else if (
        !Array.isArray(merged[key])
        && typeof merged[key] === 'object'
        && !Array.isArray(value)
        && typeof value === 'object'
      ) {
        merged[key] = this._mergeAdditionalKwargs(
          merged[key] as NonNullable<BaseMessageFields['additional_kwargs']>,
          value as NonNullable<BaseMessageFields['additional_kwargs']>,
        );
      }
      else {
        throw new TypeError(
          `additional_kwargs[${key}] already exists in this message chunk and cannot be merged.`,
        );
      }
    }
    return merged;
  }

  concat(chunk: CustomAIMessageChunk) {
    return new CustomAIMessageChunk({
      content: this.content + chunk.content,
      additional_kwargs: CustomAIMessageChunk._mergeAdditionalKwargs(
        this.additional_kwargs,
        chunk.additional_kwargs,
      ),
    });
  }
}

function isAiMessageChunkFields(value: unknown): value is BaseMessageFields {
  if (typeof value !== 'object' || value == null)
    return false;
  return 'content' in value && typeof value.content === 'string';
}

export function isAiMessageChunkFieldsList(
  value: unknown[],
): value is BaseMessageFields[] {
  return value.length > 0 && value.every(x => isAiMessageChunkFields(x));
}
