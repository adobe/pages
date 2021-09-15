declare global {
  interface Window { 
    /**
     * Common, always available namespace
     */
    pages: PagesNamespace; 
  }
}

interface PagesNamespace {
  /**
   * Product subpath
   * ie. `stock`
   */
  product: string;
  /**
   * Locale subpath
   * ie. `en`
   */
  locale?: string; 
  /**
   * Family subpath
   */
  family?: string;
  /**
   * Project subpath
   * ie. `advocates`
   */
  project?: string;

  /**
   * Whether current page is using a template.
   */
  usingTemplate: boolean;

  /**
   * Whether page has completed decorating.
   * Must be true before appearMain() will complete.
   */
  decorated?: boolean;

  /**
   * Register an event listener on the namespace.
   */
  on: (type: string | undefined, handler: (...p: any[]) => any) => (() => void);
}

export {};