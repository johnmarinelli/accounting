library(shiny)

# define UI for application that draws a histogram
shinyUI(fluidPage(
  # App title
  titlePanel("lmao money hahahaha"),

  # Sidebar w/ slider input for # of bins
  sidebarLayout(
    sidebarPanel(
    ),

    mainPanel(
      plotOutput("distPlot")
    )
  )
))
