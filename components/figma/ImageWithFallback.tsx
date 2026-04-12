import React, { useEffect, useState } from 'react'

type LoadingEffect = 'pulse' | 'static' | 'none'
type NativeImageProps = React.ComponentPropsWithoutRef<'img'>

interface ImageWithFallbackProps extends NativeImageProps {
  loadingEffect?: LoadingEffect
  mobileSrc?: string
}

// Use backticks to safely handle the long base64 string and prevent newline syntax errors
const ERROR_IMG_SRC = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==`

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const {
    src,
    alt,
    style,
    className,
    onLoad,
    onError,
    loading = 'lazy',
    decoding = 'async',
    loadingEffect = 'static',
    mobileSrc,
    ...rest
  } = props

  useEffect(() => {
    setDidError(false)
    setIsLoaded(false)
  }, [src])

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setDidError(true)
    onError?.(event)
  }

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true)
    onLoad?.(event)
  }

  const loadingClassName = isLoaded
    ? ''
    : loadingEffect === 'pulse'
      ? 'animate-pulse bg-[#dfe6ef]'
      : loadingEffect === 'static'
        ? 'bg-[#dfe6ef]'
        : ''

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} />
      </div>
    </div>
  ) : (
    <picture>
      {mobileSrc && <source media="(max-width: 768px)" srcSet={mobileSrc} />}
      <img
        src={src}
        alt={alt}
        className={`${className ?? ''} ${loadingClassName}`.trim()}
        style={style}
        loading={loading}
        decoding={decoding}
        {...rest}
        onError={handleError}
        onLoad={handleLoad}
      />
    </picture>
  )
}
