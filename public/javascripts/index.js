const categorySelect = document.querySelector('#categorySelect')

calculateTotalAmount() //INITIALIZE
categorySelect.addEventListener('change', () => {
  sortRecordCategory()
  calculateTotalAmount()
})

function calculateTotalAmount() {
  const totalAmount = document.querySelector('.total-amount')
  const itemAmount = document.querySelectorAll('.item-amount')
  let totalAmountTemp = 0
  
  itemAmount.forEach(amount => {
    // ADD TO TOTAL AMOUNT IF THE RECORD ISN'T HIDDEN
    if (!amount.parentElement.matches('.d-none')) {
      totalAmountTemp += Number(amount.innerText)
    }
  })

  totalAmount.innerText = totalAmountTemp
}

function sortRecordCategory() {
  const categoryId = Number(categorySelect.value)
  const records = document.querySelectorAll('.list-group-item')

  records.forEach(record => {
    // HIDE THE RECORD IF ITS CATEGORY DOESN'T MATCH(EXCEPTING THE ALL CATEGORY OPTION)
    if (categoryId !== 0 && Number(record.dataset.category) !== categoryId) {
      return record.classList.add('d-none')
    }
    record.classList.remove('d-none')
  })
}