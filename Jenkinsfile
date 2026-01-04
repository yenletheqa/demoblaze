pipeline {
    agent any

    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select browser'
        )
        choice(
            name: 'SUITE',
            choices: ['LoginUI', 'SearchUI', 'LoginAPI', 'SearchAPI'],
            description: 'Select test suite'
        )
    }

    environment {
        PLAYWRIGHT_BROWSERS_PATH = '0'
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
                    def grepPattern = ''

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

                        npx playwright test \
                          --project=${params.BROWSER} \
                          --grep "${grepPattern}"
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