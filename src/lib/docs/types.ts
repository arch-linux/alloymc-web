export interface DocPage {
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  sections: DocSection[];
}

export interface DocSection {
  id: string;
  title: string;
  content?: string; // markdown-ish text (rendered as paragraphs)
  code?: string; // code example
  codeLang?: string;
  methods?: ApiMethod[];
  fields?: ApiField[];
  enumValues?: EnumValue[];
  subsections?: DocSection[];
}

export interface ApiMethod {
  signature: string;
  description: string;
  params?: { name: string; type: string; description: string }[];
  returns?: { type: string; description: string };
  example?: string;
}

export interface ApiField {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
  required?: boolean;
}

export interface EnumValue {
  name: string;
  description: string;
  value?: string;
}

export interface DocCategory {
  id: string;
  label: string;
  order: number;
}
