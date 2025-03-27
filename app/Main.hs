{-# LANGUAGE OverloadedStrings #-}

import Web.Scotty

main :: IO ()
main = scotty 3000 $ do
    get "/" $ file "static/index.html"
    get "/style.css" $ file "static/style.css"
    get "/game.js" $ file "static/game.js"





