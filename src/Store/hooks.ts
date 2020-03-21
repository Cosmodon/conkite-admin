import React, { useState, useEffect } from 'react';
import { MobXProviderContext } from "mobx-react";

export const useStore = () => React.useContext(MobXProviderContext).store.app;
export const useUserStore = () => React.useContext(MobXProviderContext).store.user;
export const usePhonebookStore = () => React.useContext(MobXProviderContext).store.phonebook;
