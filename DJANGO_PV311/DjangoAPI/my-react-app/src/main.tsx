import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./store";
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import {AppWrapper} from "./components/common/PageMeta.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
    <>
        <ThemeProvider>
            <AppWrapper>
                <Provider store={store}>
                    <GoogleOAuthProvider clientId={"392333680083-lkmvmouhgs150sbnsoe62ki525or112m.apps.googleusercontent.com"}>
                        <BrowserRouter>
                            <App/>
                        </BrowserRouter>
                    </GoogleOAuthProvider>
                </Provider>
            </AppWrapper>
        </ThemeProvider>
    </>,
)
