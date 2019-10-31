import React from 'react'

import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

storiesOf('Button', module)
    .add('with text', () => <button>Hello Button</button>)
    .add('with emoji', () => (
        <button>
            <span role="img" aria-label="so cool">
                😀 😎 👍 💯
            </span>
        </button>
    ))
