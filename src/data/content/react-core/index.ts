import type { Topic } from '../../types'
import { useState } from './use-state'
import { useEffect } from './use-effect'
import { useRef } from './use-ref'
import { useMemo } from './use-memo'
import { useCallback } from './use-callback'
import { useContext } from './use-context'
import { useReducer } from './use-reducer'
import { useLayoutEffect } from './use-layout-effect'
import { useTransition } from './use-transition'
import { useDeferredValue } from './use-deferred-value'
import { useImperativeHandle } from './use-imperative-handle'
import { virtualDom } from './virtual-dom'
import { renderingCycle } from './rendering-cycle'
import { reactMemo } from './react-memo'
import { useId } from './use-id'
import { useSyncExternalStore } from './use-sync-external-store'
import { useHook } from './use-hook'
import { useOptimistic } from './use-optimistic'
import { useActionState } from './use-action-state'
import { batching } from './batching'
import { strictMode } from './strict-mode'
import { eventSystem } from './event-system'
import { jsxTransform } from './jsx-transform'

export const reactCoreTopics: Topic[] = [
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  useReducer,
  useLayoutEffect,
  useTransition,
  useDeferredValue,
  useImperativeHandle,
  virtualDom,
  renderingCycle,
  reactMemo,
  useId,
  useSyncExternalStore,
  useHook,
  useOptimistic,
  useActionState,
  batching,
  strictMode,
  eventSystem,
  jsxTransform,
]
