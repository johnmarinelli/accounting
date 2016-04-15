library(shiny)

d3 <- function(inputoutputID) {
  div(id=inputoutputID,class=inputoutputID)
}

# define UI for application that draws a histogram
shinyUI(fluidPage(
  # App title
  titlePanel("lmao money hahahaha"),
  mainPanel(
    tags$link(rel = "stylesheet", type = "text/css", href = "assets/stylesheets/css/style.css"),
    tags$script(src="http://d3js.org/d3.v3.js"),
    tags$script(src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js")
  ),

  fluidRow(
    column(12, 
      div(
        textOutput("moneyPerDay"), class = "money-per-day"
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
