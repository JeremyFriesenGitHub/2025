import doubleChevronDown from '@cuhacking/shared/assets/icons/general/double-chevron-down-white-1.svg'

import { cn } from '@cuhacking/shared/utils/cn'
import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import * as React from 'react'

import { forwardRef, useEffect } from 'react'
import { Badge } from './badge'
import { Command, CommandGroup, CommandItem, CommandList } from './command'

export interface Option {
  value: string
  label: string
  disable?: boolean
  /** fixed option that can't be removed. */
  fixed?: boolean
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined
}
interface GroupOption {
  [key: string]: Option[]
}

interface MultipleSelectorProps {
  isRequired: boolean
  name: string
  form: any
  value?: Option[]
  defaultOptions?: Option[]
  /** manually controlled options */
  options?: Option[]
  placeholder?: string
  /** Loading component. */
  loadingIndicator?: React.ReactNode
  /** Empty component. */
  emptyIndicator?: React.ReactNode
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   */
  triggerSearchOnFocus?: boolean
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   */
  onSearchSync?: (value: string) => Option[]
  onChange?: (options: Option[]) => void
  /** Limit the maximum number of selected options. */
  maxSelected?: number
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean
  disabled?: boolean
  /** Group the options base on provided key. */
  groupBy?: string
  className?: string
  badgeClassName?: string
  setValidInput?: React.Dispatch<React.SetStateAction<boolean>>
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >
  /** hide the clear all button. */
}

export interface MultipleSelectorRef {
  selectedValue: Option[]
  input: HTMLInputElement
  focus: () => void
  reset: () => void
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {}
  }
  if (!groupBy) {
    return {
      '': options,
    }
  }

  const groupOption: GroupOption = {}
  options.forEach((option) => {
    const key = (option[groupBy] as string) || ''
    if (!groupOption[key]) {
      groupOption[key] = []
    }
    groupOption[key].push(option)
  })
  return groupOption
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(val => !picked.find(p => p.value === val.value))
  }
  return cloneOption
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some(option => targetOption.find(p => p.value === option.value))) {
      return true
    }
  }
  return false
}

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 */
const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState(state => state.filtered.count === 0)

  if (!render)
    return null

  return (
    <div
      ref={forwardedRef}
      className={cn('py-6 text-center text-sm', className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  )
})

CommandEmpty.displayName = 'CommandEmpty'

const MultipleSelector = React.forwardRef<MultipleSelectorRef, MultipleSelectorProps>(
  (
    {
      value,
      name,
      form,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      isRequired,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      setValidInput,
    }: MultipleSelectorProps,
    ref: React.Ref<MultipleSelectorRef>,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [onScrollbar, setOnScrollbar] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    const [selected, setSelected] = React.useState<Option[]>(value || [])
    const [options, setOptions] = React.useState<GroupOption>(
      transToGroupOption(arrayDefaultOptions, groupBy),
    )
    const [inputValue, setInputValue] = React.useState('')
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500)

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected([]),
      }),
      [selected],
    )

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current
        && !dropdownRef.current.contains(event.target as Node)
        && inputRef.current
        && !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
        inputRef.current.blur()
      }
    }

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter(s => s.value !== option.value)
        setSelected(newOptions)
        if (form) {
          form.setValue(name, newOptions, { shouldValidate: true })
        }
        if (setValidInput) {
          setValidInput(!isRequired || newOptions.length > 0)
        }
        onChange?.(newOptions)
      },
      [onChange, selected, isRequired, setValidInput],
    )

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.value === '' && selected.length > 0) {
              const lastSelectOption = selected[selected.length - 1]
              // If last item is fixed, we should not remove it.
              if (!lastSelectOption.fixed) {
                handleUnselect(selected[selected.length - 1])
              }
            }
          }
          // This is not a default behavior of the <input /> field
          if (e.key === 'Escape') {
            input.blur()
          }
        }
      },
      [handleUnselect, selected],
    )

    useEffect(() => {
      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchend', handleClickOutside)
      }
      else {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }
    }, [open])

    useEffect(() => {
      if (value) {
        setSelected(value)
      }
    }, [value])

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy)
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption)
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options])

    useEffect(() => {
      /** sync search */

      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm)
        setOptions(transToGroupOption(res || [], groupBy))
      }

      const exec = async () => {
        if (!onSearchSync || !open)
          return

        if (triggerSearchOnFocus) {
          doSearchSync()
        }

        if (debouncedSearchTerm) {
          doSearchSync()
        }
      }

      void exec()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

    useEffect(() => {
      /** async search */

      const doSearch = async () => {
        setIsLoading(true)
        const res = await onSearch?.(debouncedSearchTerm)
        setOptions(transToGroupOption(res || [], groupBy))
        setIsLoading(false)
      }

      const exec = async () => {
        if (!onSearch || !open)
          return

        if (triggerSearchOnFocus) {
          await doSearch()
        }

        if (debouncedSearchTerm) {
          await doSearch()
        }
      }

      void exec()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

    const CreatableItem = () => {
      if (!creatable)
        return undefined
      if (
        isOptionsExist(options, [{ value: inputValue, label: inputValue }])
        || selected.find(s => s.value === inputValue)
      ) {
        return undefined
      }

      const Item = (
        <CommandItem
          value={inputValue}
          className="pl-8 cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onSelect={(value: string) => {
            if (selected.length >= maxSelected) {
              onMaxSelected?.(selected.length)
              return
            }
            setInputValue('')
            const newOptions = [...selected, { value, label: value }]
            setSelected(newOptions)
            if (form) {
              form.setValue(name, newOptions, { shouldValidate: true })
            }
            if (setValidInput) {
              setValidInput(!isRequired || newOptions.length > 0)
            }
            onChange?.(newOptions)
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      )

      // For normal creatable
      if (!onSearch && inputValue.length > 0) {
        return Item
      }

      // For async search creatable. avoid showing creatable item before loading at first.
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return Item
      }

      return undefined
    }

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator)
        return undefined

      // For async search that showing emptyIndicator
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value="-" disabled>
            {emptyIndicator}
          </CommandItem>
        )
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>
    }, [creatable, emptyIndicator, onSearch, options])

    const selectables = React.useMemo<GroupOption>(
      () => removePickedOption(options, selected),
      [options, selected],
    )

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1
        }
      }
      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined
    }, [creatable, commandProps?.filter])

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        onKeyDown={(e) => {
          handleKeyDown(e)
          commandProps?.onKeyDown?.(e)
        }}
        className={cn('h-auto overflow-visible', commandProps?.className)}
        shouldFilter={
          commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch
        } // When onSearch is provided, we don't want to filter the options. You can still override it.
        filter={commandFilter()}
      >
        <button
          type="button"
          className={cn(
            'h-auto rounded-md border border-border text-base backdrop-blur-md bg-card hover:bg-white/10 p-1.5',
            {
              'py-2': selected.length !== 0,
              'cursor-text': !disabled && selected.length !== 0,
            },
            className,
          )}
          aria-label={`${name} trigger`}
          onClick={() => {
            if (disabled)
              return
            inputRef?.current?.focus()
          }}
        >
          <div className="flex flex-col ">
            <div className="relative flex flex-wrap gap-1 items-center ">
              {selected.map((option) => {
                return (
                  <Badge
                    key={option.value}
                    className={cn(
                      'data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground',
                      'data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground',
                      badgeClassName,
                    )}
                    data-fixed={option.fixed}
                    data-disabled={disabled || undefined}
                  >
                    {option.label}
                    {/* Visible removal button */}
                    <button
                      type="button"
                      className={cn(
                        'ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        (disabled || option.fixed) && 'hidden',
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUnselect(option)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => handleUnselect(option)}
                    >
                      &times;
                    </button>
                  </Badge>
                )
              })}

            </div>
            <div className="flex gap-1 items-center cursor-pointer">
              <img src={doubleChevronDown} className="size-6" />
              {/* Avoid having the "Search" Icon */}
              <CommandPrimitive.Input
                {...inputProps}
                ref={inputRef}
                value={inputValue}
                disabled={disabled}
                onValueChange={(value) => {
                  setInputValue(value)
                  inputProps?.onValueChange?.(value)
                }}
                onBlur={(event) => {
                  if (!onScrollbar) {
                    setOpen(false)
                  }
                  inputProps?.onBlur?.(event)
                }}
                onFocus={(event) => {
                  setOpen(true)
                  inputProps?.onFocus?.(event)
                }}
                placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder}
                className={cn(
                  'flex-1  bg-transparent outline-none placeholder:text-muted placeholder:text-base placeholder:italic cursor-pointer',
                  {
                    'w-full': hidePlaceholderWhenSelected,
                    '': selected.length === 0,
                    'ml-1': selected.length !== 0,
                  },
                  inputProps?.className,
                )}
              />
            </div>
          </div>
        </button>
        <div className="relative">
          {open && (
            <CommandList
              className="absolute top-1 z-10 w-full rounded-md border bg-background text-popover-foreground shadow-md outline-none animate-in"
              onMouseLeave={() => {
                setOnScrollbar(false)
              }}
              onMouseEnter={() => {
                setOnScrollbar(true)
              }}
              onMouseUp={() => {
                inputRef?.current?.focus()
              }}
            >
              {isLoading
                ? (
                    <>{loadingIndicator}</>
                  )
                : (
                    <>
                      {EmptyItem()}
                      {CreatableItem()}
                      {!selectFirstItem && <CommandItem value="-" className="hidden" />}
                      {Object.entries(selectables).map(([key, dropdowns]) => (
                        <CommandGroup key={key} heading={key} className="h-full overflow-auto">
                          <>
                            {dropdowns.map((option) => {
                              return (

                                <CommandItem
                                  key={option.value}
                                  value={option.label}
                                  disabled={option.disable}
                                  onMouseDown={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                  }}
                                  onSelect={() => {
                                    if (selected.length >= maxSelected) {
                                      onMaxSelected?.(selected.length)
                                      return
                                    }
                                    setInputValue('')
                                    const newOptions = [...selected, option]

                                    if (form) {
                                      form.setValue(name, newOptions, { shouldValidate: true })
                                    }

                                    if (setValidInput) {
                                      setValidInput(!isRequired || newOptions.length > 0)
                                    }
                                    setSelected(newOptions)
                                    onChange?.(newOptions)
                                  }}
                                  className={cn(
                                    'pl-8 cursor-pointer',
                                    option.disable && 'cursor-default text-muted-foreground',
                                  )}
                                >

                                  <button
                                    role="menu"
                                    type="button"
                                    aria-label={`command item ${option.value}`}
                                  >
                                    {option.label}

                                  </button>
                                </CommandItem>
                              )
                            })}
                          </>
                        </CommandGroup>
                      ))}
                    </>
                  )}
            </CommandList>
          )}
        </div>
      </Command>
    )
  },
)

MultipleSelector.displayName = 'MultipleSelector'
export default MultipleSelector
