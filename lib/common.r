library(functional) # for Compose
library(timeDate) # for date functions

get_rows_by_daterange <- function(rows, daterange, date_col_name = "Date") {
  begin_date = format(daterange[1])
  end_date = format(daterange[2])
  rows[rows[date_col_name] > begin_date & rows[date_col_name] < end_date,]
}

# Returns a data.frame of Category | Frequency
x_by_y <- function(rows, x_col_name = "Category", y_col_name = "Frequency") {
  x_by_y <- data.frame(rows[y_col_name], rows[x_col_name])
  colnames(x_by_y) <- c(y_col_name, x_col_name)
  agg <- aggregate(rows[,y_col_name], by = list(Category = rows[,x_col_name]), FUN = sum)
}

# Apply fn to coll every n times.
every <- function(coll, n, fn) {
  new <- c()
  for(i in 1:length(coll)) {
    if (i %% n == 0) new <- c(new, fn(coll[i]))
  } 
  new
}

# get begin and end of current month
get_month_range <- function(date = Sys.Date()) {
  c(as.Date(timeFirstDayInMonth(date)), as.Date(timeLastDayInMonth(date)))
}

# Return a formatted string for USD.
format_currency <- function(amt) {
  paste("$", format(amt, nsmall = 2, digits = 2, big.mark = ",", scientific = FALSE), sep = "")
}

# dates come in m/dd/yyyy format
factor_to_date <- function(fdate) {
  as.Date(fdate, "%m/%d/%Y")
}

filter_expenses <- function(raw_data) {
  # remove columns that aren't related to expenses
  i_dont_care <- c("Cash & ATM", "Transfer", "Reimbursement", "Paycheck", "Income")
  split_data <- raw_data[!(raw_data$Category %in% i_dont_care),]
  
  date_origin <- '1970-01-01'
  
  # transform factors to dates
  split_data$Date <- as.Date(unlist(lapply(split_data$Date, factor_to_date)), origin = date_origin)  
  preprocessed_data <- split_data
}

load <- function(filepath) {
  read.csv(filepath)
}

get_expenses <- Compose(load, filter_expenses)
