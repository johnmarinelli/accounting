source('lib/common.r')

# get total amount spent by category
amount_by_category <- function(transactions) {
  x_by_y(transactions, 'Category', 'Amount')
}

get_amount_by_category <- function(preprocessed_data) {
  amt_by_cat <- amount_by_category(preprocessed_data) 
  colnames(amt_by_cat) <- c('Category', 'Amount')
  amt_by_cat
}
