library(shiny)

d3 <- function(inputoutputID) {
  div(id=inputoutputID,class=inputoutputID)
}

# define UI for application that draws a histogram
shinyUI(fluidPage(
  # App title
  titlePanel("lmao money hahahaha"),
  mainPanel(
    tags$script(src="http://d3js.org/d3.v3.js")
  ),

  fluidRow(
    column(12, 
      textOutput("moneyPerDay")
    )
  ),

  fluidRow(
    column(12,
      d3("barplot"),
      includeScript("assets/js/compiled/bundle.js")
    )
  )
))
