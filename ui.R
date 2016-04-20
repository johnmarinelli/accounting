library(shiny)

d3 <- function(inputoutputID) {
  div(id=inputoutputID,class=inputoutputID)
}

shinyUI(fluidPage(
  div(htmlTemplate("views/navbar.html", dateRange = uiOutput("dateRange"))),
  
  mainPanel(
    tags$link(rel = "stylesheet", type = "text/css", href = "assets/stylesheets/style.css"),
    tags$script(src="assets/js/d3.v3.js"),
    tags$script(src="assets/js/d3.tip.v0.6.3.js")
  ),

  fluidRow(
    column(12, 
      div(
        "You've spent an average of ",
        strong(textOutput("moneyPerDay")),
        " daily.",
        class = "money-per-day"
      )
    )
  ),

  fluidRow(
    column(12,
      d3("barplot"),
      includeScript("assets/js/compiled/bundle.js")
    )
  )
))
