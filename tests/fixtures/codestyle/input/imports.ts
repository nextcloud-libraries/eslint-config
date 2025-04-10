/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { t } from '@nextcloud/l10n'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import type { NcSelectOption } from '../composables/useNcSelectModel.ts'
import type { useHotKey } from '@nextcloud/vue/composables/useHotKey'

import NcButton from '@nextcloud/vue/components/NcButton'
import type { ButtonVariant } from '@nextcloud/vue/components/NcButton'
import { z, a, y } from '../../../constants.js'
import { useAppConfigStore } from './appConfig.store.ts'

import SettingsFormGroup from './components/SettingsFormGroup.vue'
import IconBellRingOutline from 'vue-material-design-icons/BellRingOutline.vue'
import 'some-sideeffect'

import type { AssertPredicate } from 'node:assert'
import style from './my.module.css'
