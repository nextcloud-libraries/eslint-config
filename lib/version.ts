/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import packageJson from '../package.json' with { type: 'json' }

export const packageVersion: string = packageJson.version
