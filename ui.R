library(shiny)

d3 <- function(inputoutputID) {
  div(id=inputoutputID,class=inputoutputID)
}

shinyUI(fluidPage(
  div(htmlTemplate("views/navbar.html", dateRange = uiOutput("dateRange"))),

  div(includeScript("www/main.out/goog/base.js")),
  div(includeScript("www/main.js"))
  
))
