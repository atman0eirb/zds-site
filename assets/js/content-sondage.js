/**
 * The full survey is contained in a div or article that has class "quizz".
 * Then one question is inside a zmarkdown "custom-block" of type "custom-block-quizz".
 *
 * <code>
 *   <div class="custom-block custom-block-quizz">
 *     <div class="custom-block-heading">The question</div>
 *     <div class="custom-block-body">
 *       <ul>
 *            <li><input type="checkbox" value="the answer"/>the answer</li>
 *            <li><input type="checkbox" value="the answer" />the answer</li>
 * 
 *       </ul>
 *     </div>
 *   </div>
 * </code>

 */


var currentURL = window.location.href;

if (currentURL.includes("forums")) {

  let indeX = 0;
  function Makesurvey(inputDomElementList) {


    inputDomElementList.forEach((rb) => {


      const ulWrapperElement = rb.parentElement.parentElement
      // we give the ui an id to find the element in a more effective way later when the users answer the questions
      if (!ulWrapperElement.getAttribute('id')) {
        ulWrapperElement.setAttribute('id', 'id-' + (indeX++))
      }

      rb.setAttribute('name', ulWrapperElement.getAttribute('id'))
      rb.setAttribute('type', 'radio')

      const questionBlock = ulWrapperElement.parentElement.parentElement
      questionBlock.setAttribute('data-name', rb.getAttribute('name'))


      rb.disabled = false
      rb.checked = false

    })
  }


  function initializeRadio() {
    const radio = document.querySelectorAll('.custom-block-quizz input');
    Makesurvey(radio)

  }

  const initializePipeline = [initializeRadio]

  let idCounter = 0

  function SurveyButtons(survey) {

    const submit = document.createElement('button')
    submit.innerText = 'Voter'

    submit.classList.add('btn', 'btn-submit')
    submit.setAttribute('id', `my-button-${idCounter}`);

    const notAnswered = document.createElement('p')
    notAnswered.classList.add('notAnswered')

    survey.appendChild(submit)
    survey.appendChild(notAnswered)

  }




  initializePipeline.forEach(func => func())

  document.querySelectorAll('div.custom-block-quizz').forEach(div => {
    SurveyButtons(div)
  })



  // not complet , a test example only
  function sendSurvey() {
    const csrfmiddlewaretoken = document.querySelector('input[name=\'csrfmiddlewaretoken\']').value
    const xhttp = new XMLHttpRequest()
    const url = '/forums/survey/'
    const data = {
      "survey": {
        "ahaaa": [
          "a",
          "b",
          "c",
          "d"
        ]

      },
      "result": [
        "c"
      ],
      "url": "http://0.0.0.0:8000/tutoriels/11/stats/#1-double"
    }
    xhttp.open('POST', url)
    xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.setRequestHeader('X-CSRFToken', csrfmiddlewaretoken)
    xhttp.send(JSON.stringify(data))
  }

  document.querySelectorAll('div.custom-block-quizz').forEach(div => {
    const submit = div.querySelector('.btn-submit')
    submit.addEventListener('click', () => {
      sendSurvey()

    })
  })

}


