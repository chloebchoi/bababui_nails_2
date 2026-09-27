import React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'behold-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 'feed-id': string }, HTMLElement>
    }
  }
}