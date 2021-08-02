declare global {
  interface Window { 

    /**
     * Common, always available namespace
     */
    pages: PagesNamespace; 

    /**
     * Current form configuration object
     */
    formConfig: FormConfig;

    /**
     * Loads a CSS file.
     * @param {string} href The path to the CSS file
     */
    loadCSS(href: string): void;
  }
}

interface PagesNamespace {
  product: string;
  locale: string; 
  project: string;
}

interface FormConfig {
  /**
   * Form sheet destination URL
   */
  sheet: string;
  /**
   * Redirect path
   */
  redirect: string;
  /**
   * Form definition object
   */
  definition: string;
}

export {};