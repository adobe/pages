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

// @ts-check

/**
 * List of paths to check.
 * For now this is manually collected.
 */
export default [
  '/aem/de/einfach-Sites/index',
  '/cc-growth-sandbox/test/dynamic/index',
  '/cc-growth-sandbox/test/set-widths/index',
  '/components/index',
  '/creativecloud/en/ai-and-ps-together/index',
  '/creativecloud/en/birthday-thanks-templates/ai/happy-birthday/index',
  '/creativecloud/en/birthday-thanks-templates/ai/index',
  '/creativecloud/en/birthday-thanks-templates/ai/thank-you/index',
  '/creativecloud/en/birthday-thanks-templates/ps/happy-birthday/index',
  '/creativecloud/en/birthday-thanks-templates/ps/index',
  '/creativecloud/en/birthday-thanks-templates/ps/thank-you/index',
  '/creativecloud/en/ete/how-adobe-apps-work-together/index',
  '/creativecloud/en/lr-and-ps-together/index',
  '/creativecloud/en/photography-plan/all/index',
  '/creativecloud/en/photography-plan/index',
  '/creativecloud/en/photography-plan/lightroom-classic/color-grading/dive-deep/index',
  '/creativecloud/en/photography-plan/lightroom-classic/color-grading/get-started/index',
  '/creativecloud/en/photography-plan/lightroom/index',
  '/creativecloud/en/photography-plan/photohop-old/design/index',
  '/creativecloud/en/photography-plan/photohop-old/edit/index',
  '/creativecloud/en/photography-plan/photohop/design/index',
  '/creativecloud/en/photography-plan/photohop/edit/index',
  '/creativecloud/en/photography-plan/photoshop/design/index',
  '/creativecloud/en/photography-plan/photoshop/edit/index',
  '/creativecloud/en/photography-plan/ps-lr/index',
  '/creativecloud/en/photography-plan/ps-lrc/index',
  // '/creativecloud/en/status-page/index', // causes 429s on hlx2
  '/creativecloud/en/ste/ai-and-ps-together/index',
  '/creativecloud/en/youtube-ps/index',
  '/documentation/en/form-example/index',
  '/general/en/inclusive/feedback/index',
  '/ihearttech/en/index',
  '/illustrator/de/tl-pd-media/illustration/index',
  '/illustrator/de/tl-pd-media/layout/index',
  '/illustrator/de/tl/thr-illustration-home/index',
  '/illustrator/de/tl/thr-layout-home/index',
  '/illustrator/en/14-day-Trial/illustration/index',
  '/illustrator/en/14-day-Trial/layout/index',
  '/illustrator/en/ai-sa/illustration/index',
  '/illustrator/en/ai-sa/layout/index',
  '/illustrator/en/all-apps/sai-users/layout/index',
  '/illustrator/en/all-apps/sai-users/illustration/index',
  '/illustrator/en/paid-media/tl/illustration/index',
  '/illustrator/en/mission/index',
  '/illustrator/en/ste/pls/illustration/index',
  '/illustrator/en/paid-media/tl/layout/index',
  '/illustrator/en/test-environment/ai-scientist/index',
  '/illustrator/en/ste/pls/layout/index',
  '/illustrator/en/tl/thr-layout-home/index',
  '/illustrator/en/tl/thr-illustration-home/index',
  '/illustrator/en/wayne-sandbox/test/index',
  '/illustrator/en/version-two/project-one/index',
  '/illustrator/es/tl-pd-media/layout/index',
  '/illustrator/es/tl-pd-media/illustration/index',
  '/illustrator/es/tl/thr-layout-home/index',
  '/illustrator/es/tl/thr-illustration-home/index',
  '/illustrator/fr/tl-pd-media/layout/index',
  '/illustrator/fr/tl-pd-media/illustration/index',
  '/illustrator/fr/tl/thr-layout-home/index',
  '/illustrator/fr/tl/thr-illustration-home/index',
  '/illustrator/jp/tl-pd-media/illustration/index',
  '/illustrator/jp/scientist/index',
  '/illustrator/jp/tl/thr-illustration-home/index',
  '/illustrator/jp/tl-pd-media/layout/index',
  '/illustrator/ko/tl-pd-media/illustration/index',
  '/illustrator/ko/ai-scientist/index',
  '/illustrator/ko/tl/thr-illustration-home/index',
  '/illustrator/ko/tl-pd-media/layout/index',
  '/illustrator/pt/tl-pd-media/illustration/index',
  '/illustrator/ko/tl/thr-layout-home/index',
  '/illustrator/pt/tl/thr-illustration-home/index',
  '/illustrator/pt/tl-pd-media/layout/index',
  '/index',
  '/illustrator/pt/tl/thr-layout-home/index',
  '/lightroom-classic/en/learn/color-grading/dive-deep/index',
  '/internal/en/9fywoo0R/index',
  '/lightroom-classic/en/learn/color-grading/index',
  '/lightroom-classic/en/learn/color-grading/get-started/index',
  '/photoshop/br/tl/design/index',
  '/lightroom-classic/en/learn/lrc-to-ps/index',
  '/photoshop/en/14-day-trial/design/index',
  '/photoshop/br/tl/photo/index',
  '/photoshop/en/all-apps/sps-users/design/index',
  '/photoshop/en/14-day-trial/photo/index',
  '/photoshop/en/paid-media/tl/design/index',
  '/photoshop/en/all-apps/sps-users/photo/index',
  '/photoshop/en/prerelease-api/index',
  '/photoshop/en/paid-media/tl/photo/index',
  '/photoshop/en/psx-feedback/index',
  '/photoshop/en/ps-sa-d2p/design/index',
  '/photoshop/en/ste/pls/photo/index',
  '/photoshop/en/ste/pls/design/index',
  '/photoshop/en/twp3/design/index',
  '/photoshop/en/test-environment/index',
  '/photoshop/es/tl/design/index',
  '/photoshop/en/twp3/photo/index',
  '/photoshop/ko/twp/index',
  '/photoshop/es/tl/photo/index',
  '/photoshop/ko/twp3/photo/index',
  '/photoshop/ko/twp3/design/index',
  '/premiere-rush/en/text-the-link/index',
  '/premiere-rush/de/text-the-link/index',
  '/premiere-rush/fr/text-the-link/index',
  '/premiere-rush/es/text-the-link/index',
  '/premiere-rush/kr/text-the-link/index',
  '/premiere-rush/jp/text-the-link/index',
  '/premiere/en/14-day-trial/index',
  '/premiere/de/speechtotext/index',
  '/premiere/en/tl-masterclass/index',
  '/premiere/en/speechtotext/index',
  '/premiere/jp/speechtotext/index',
  '/premiere/fr/speechtotext/index',
  '/static/ete/hero-posters/index',
  '/premiere/kr/speechtotext/index',
  '/static/lightroom-classic/index',
  '/static/internal/index',
  '/static/templates/stock-advocates/index',
  '/static/lr-ps/hero-posters/index',
  '/static/twp3/index',
  '/static/twp3/background-elements/index',
  '/stock/en/artisthub/index',
  '/stock/en/advocates/index',
  '/xd/en/xd-plugin-download/index',
  '/xd/en/xd-file-download/index',
];
