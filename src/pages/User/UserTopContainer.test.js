import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider, useQueryClient } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { FriendsProvider } from "../../context/FriendsProvider";
import LoginProvider from "../../context/LoginProvider";
import { UserProvider } from "../../context/UserProvider";
import { UserTopContainer } from "./UserTopContainer";

const queryClient = new QueryClient()

describe('top container for wallodya', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <LoginProvider>
                    <UserProvider login={"walloyda"}>
                        <FriendsProvider>
                            <UserTopContainer/>
                        </FriendsProvider>
                    </UserProvider>
                </LoginProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )

    test('should not be banned', async () => {
        await setTimeout(() => {
            expect(screen.queryByText(/banned/i)).toBeNull()
        }, 3000)
    })

    test('login should be wallodya', async () => { 
        await setTimeout(async () => {
            const login = await screen.findByText("wallodya")
            expect(login).toBeInTheDocument()
        },3000)
    })
    test('email should be wallodya@test.com', async () => {
        await setTimeout(async () => {
            const email = await screen.findByText("wallodya@test.com")
            expect(email).toBeInTheDocument()
        }, 3000)
    })
})

describe('top container for qqqq', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <LoginProvider>
                    <UserProvider login={"qqqq"}>
                        <FriendsProvider>
                            <UserTopContainer/>
                        </FriendsProvider>
                    </UserProvider>
                </LoginProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )

    test('should be banned', async () => {
        await setTimeout(() => {
            expect(screen.getByText('banned')).toBeInTheDocument()
        })
    })

    test('login should be qqqq', async() => {
        await setTimeout(async () => {
            const login = await screen.findByText("qqqq")
            expect(login).toBeInTheDocument()
        })
    })

    test('email should be qq-qq@qq', async () => {
        await setTimeout( async () => {
            const email = await screen.findByText("qq-qq@qq")
            expect(email).toBeInTheDocument()
        })
    })
})
