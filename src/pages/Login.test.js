import { Login } from "./Login";
import { screen, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

test('login header', () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    )
    expect(screen.getAllByText(/login/i)).toBeTruthy()
})