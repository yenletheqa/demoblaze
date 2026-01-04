pipeline {
    agent any

    environment {
        UI_BASE_URL = credentials('UI_BASE_URL')
        API_BASE_URL = credentials('API_BASE_URL')
        PAGE_RENDER_TIMEOUT = '5000'
        USERNAME = credentials('USERNAME')
        PASSWORD = credentials('PASSWORD')
    }

    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select browser'
        )
        choice(
            name: 'SUITE',
            choices: ['LoginAPI', 'SearchAPI','LoginUI', 'SearchUI'],
            description: 'Select test suite'
        )
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'develop',
                    url: 'https://github.com/yenletheqa/demoblaze.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'yarn install --frozen-lockfile'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def suitePath = ''

                    if (params.SUITE == 'LoginUI') {
                        suitePath = 'tests/ui/login.spec'
                    } else if (params.SUITE == 'SearchUI') {
                        suitePath = 'tests/ui/search.spec'
                    } else if (params.SUITE == 'LoginAPI') {
                        suitePath = 'tests/api/auth.spec'
                    } else if (params.SUITE == 'SearchAPI') {
                        suitePath = 'tests/api/product.spec'
                    }

                    sh """
                        echo "Running suite: ${params.SUITE}"
                        echo "Browser: ${params.BROWSER}"

                        npx playwright test ${suitePath}\
                          --project=${params.BROWSER}
                    """
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
        }
        failure {
            echo 'Test execution failed'
        }
        success {
            echo 'Test execution completed successfully'
        }
    }
}