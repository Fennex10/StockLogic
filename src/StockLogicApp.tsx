import { RouterProvider } from "react-router"
import { appRouter } from "./router/app.router"

export const StockLogicApp = () => {
  return (
      <RouterProvider router={appRouter}/>
  )
}
