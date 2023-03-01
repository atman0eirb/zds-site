let index = 0
function extractAnswer(radio, answers) {
  radio.forEach((rb) => {
    if (!rb.parentElement.parentElement.getAttribute('id')) {
      rb.parentElement.parentElement.setAttribute('id', 'id-' + (index++))
    }
    rb.setAttribute('name', rb.parentElement.parentElement.getAttribute('id'))
    if (!answers[rb.parentNode.parentNode.getAttribute('id')]) {
      answers[rb.parentNode.parentNode.getAttribute('id')] = [rb.checked]
    } else {
      answers[rb.parentNode.parentNode.getAttribute('id')].push(rb.checked)
    }
    rb.setAttribute('value', answers[rb.parentNode.parentNode.getAttribute('id')].length - 1)
    rb.disabled = false
    rb.checked = false
  })
}

function initializeCheckboxes(answers) {
  const checkboxes = document.querySelectorAll('.sondage ul li input[type=checkbox]')
  extractAnswer(checkboxes, answers)
}

function initializeRadio(answers) {
  const radio = document.querySelectorAll('.sondage ul li input[type=radio]')
  extractAnswer(radio, answers)
}

const initializePipeline = [initializeCheckboxes, initializeRadio]

function computeForm(formdata, answers) {
  const answer = []
  const allAnswerNames = []
  for (const entry of formdata.entries()) {
    const name = entry[0]
    const value = entry[1]
    allAnswerNames.push(name)
    if (!answers[name]) {
      continue
    } else {
      // for poc we assume we only deal with radio buttons
      if (!answers[name][value]) {
        answer.push({
          name: name,
          value: value
        })
      }
    }
  }
  return [answer, allAnswerNames]
}

function handleSurveySubmit() {
  const answers = {}
  initializePipeline.forEach(func => func(answers))

  const form = document.querySelector('.survey form')
  const [badAnswers, allAnswerNames] = computeForm(new FormData(form), answers)

  markBadAnswers(badAnswers, answers)

  const goodAnswers = allAnswerNames.filter(name => !badAnswers.find(ba => ba.name === name))
  console.log(`You got ${goodAnswers.length} out of ${allAnswerNames.length} correct!`)
}
