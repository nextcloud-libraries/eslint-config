// TSX

/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * @notExported <- should work
 * @aaabbbcccddd <- should fail
 */
const foo = '' // <- should fail, as unused
