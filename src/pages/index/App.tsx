import styled from 'styled-components'
import LayoutPage from '@/containers/Layouts'

export default function App() {
    return (
        <StyledWrapper>
            <LayoutPage />
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: calc(10px + 2vmin);
    color: white;
    text-align: center;
    background-color: #282c34;

    header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50vmin;
        height: 100vh;
    }

    section {
        flex: 1;
        padding: 20px;
    }

    a {
        color: #61dafb;
    }
`
