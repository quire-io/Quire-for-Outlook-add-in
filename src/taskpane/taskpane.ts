/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */
import { KEY_TOKEN } from "../constants";
import { quireAuthentication } from "../quireService";

export async function login(): Promise<String | null> {
  if (await quireAuthentication())
    return localStorage.getItem(KEY_TOKEN);
  return null;
};
