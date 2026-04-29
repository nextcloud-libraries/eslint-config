/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ButtonVariant } from '@nextcloud/vue/components/NcButton'
import type { useHotKey } from '@nextcloud/vue/composables/useHotKey'
import type { AssertPredicate } from 'node:assert'
import type { NcSelectOption } from '../composables/useNcSelectModel.ts'
import type { Config } from './config.ts'
import type { MixedValueDefaultTypeImport } from './mixed-default-import.ts'
import type { MixedValueTypeImport } from './mixed-import.ts'
import type { Bear, Elefant, Zoo } from './zoo.ts'

import { t } from '@nextcloud/l10n'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import IconBellRingOutline from 'vue-material-design-icons/BellRingOutline.vue'
import SettingsFormGroup from './components/SettingsFormGroup.vue'
import { a, y, z } from '../../../constants.js'
import { useAppConfigStore } from './appConfig.store.ts'
import { createConfig } from './config.ts'
import MixedValueDefaultImport from './mixed-default-import.ts'
import { MixedValueImport } from './mixed-import.ts'
import {
	createBear,
	createZoo,
} from './zoo.ts'

import 'some-sideeffect'
import style from './my.module.css'
