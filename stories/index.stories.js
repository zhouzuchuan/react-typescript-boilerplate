import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { Button } from '@storybook/react/demo'

storiesOf('Button', module)
    .add('with text', () => <Button>Hello Button</Button>)
    .add('with emoji', () => (
        <Button>
            <span role="img" aria-label="so cool">
                😀 😎 👍 💯
            </span>
        </Button>
    ))
