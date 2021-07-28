/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

export interface LocalSyncOptions {
  /**
   * Path to root of mounted volume directory,
   * or whatever local directory mirrors docs/onedrive root.
   *
   * This is needed to build the post path. Ideally it would
   * come from fstab config automagically, but not now.
   */
  rootPath: string;

  /**
   * If not syncing the whole directory,
   * this is a path to the root directory to sync.
   */
  startDir?: string;

  /**
   * Repo name
   */
  repo: string;

  /**
   * Repo owner
   */
  owner: string;

  /**
   * Defaults to preview
   */
  env?: 'preview' | 'publish';

  /**
   * defaults to main
   */
  branch?: string;

  /**
   * Sync only paths that match
   * defaults to none
   */
  glob?: string;

  /**
   * Recurse in directory
   */
  recursive?: boolean;

}

export type ProgressHandler = (complete: number, total: number) => void;

interface _LocalSync {
  cancel(): void;
  onprogress(cb: ProgressHandler): () => void;
}

export interface FailedResponse {
  status: number;
  url: string;
  headers: Headers;
  path: string;
}
export interface SuccessEntry {
  path: string;
}
export type LocalSyncResolution = {
  failed?: FailedResponse[];
  synced: SuccessEntry[];
};

export type LocalSync = Promise<LocalSyncResolution> & _LocalSync;
