/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

import { quireAuthentication, KEY_TOKEN, KEY_REFRESH } from "../quireService";

export async function login(): Promise<String | null> {
  if (await quireAuthentication())
    return localStorage.getItem(KEY_TOKEN);
  return null;
};
