interface RuleLayoutContentType {
  title: string;
  contents: Array<ContentType>;
}

interface ContentType {
  subTitle: string;
  imgSrc: string;
}

export type { RuleLayoutContentType, ContentType };
