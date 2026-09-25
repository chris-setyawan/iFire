import * as tf from '@tensorflow/tfjs'

// Training dataset based on historical fire occurrence patterns in Sumatra
// Features: [temperature, humidity, rainfall, vegetation density]
// Target: fire risk score (0-100)
const trainingData = {
  // High risk scenarios
  inputs: [
    [35, 20, 5, 80],   // Very hot, dry, low rain, dense vegetation → High risk
    [38, 15, 3, 85],   // Extreme conditions → Critical risk
    [34, 25, 8, 75],   // Hot and dry → High risk
    [36, 18, 4, 82],   // Very risky conditions
    [32, 22, 10, 78],  // Moderately high risk
    
    // Medium risk scenarios
    [30, 35, 15, 70],  // Warm, moderate conditions
    [28, 40, 20, 65],  // Moderate risk
    [31, 38, 18, 68],  // Medium conditions
    [29, 42, 22, 60],  // Borderline medium-low
    [27, 45, 25, 55],  // Medium-low risk
    
    // Low risk scenarios
    [25, 55, 35, 50],  // Cool, humid, rainy → Low risk
    [22, 60, 40, 45],  // Very safe conditions
    [24, 58, 38, 48],  // Low risk
    [20, 65, 45, 40],  // Very low risk
    [23, 62, 42, 43],  // Safe conditions
    
    // Additional varied scenarios
    [33, 28, 12, 77],  // High risk
    [26, 50, 30, 52],  // Low-medium risk
    [37, 16, 6, 88],   // Critical risk
    [28, 48, 28, 58],  // Low-medium risk
    [31, 32, 16, 72],  // Medium-high risk
  ],
  outputs: [
    [85], [95], [80], [88], [75],  // High risk outputs
    [60], [55], [62], [52], [48],  // Medium risk outputs
    [30], [20], [28], [18], [25],  // Low risk outputs
    [78], [35], [92], [38], [65],  // Varied outputs
  ]
}

let model: tf.LayersModel | null = null

// Create and compile the neural network model
export async function createModel(): Promise<tf.LayersModel> {
  // Create a sequential model (feedforward neural network)
  const newModel = tf.sequential({
    layers: [
      // Input layer: 4 features (temp, humidity, rainfall, vegetation)
      tf.layers.dense({
        inputShape: [4],
        units: 16,
        activation: 'relu',
        kernelInitializer: 'heNormal'
      }),
      
      // Hidden layer 1: Non-linear transformations
      tf.layers.dense({
        units: 32,
        activation: 'relu',
        kernelInitializer: 'heNormal'
      }),
      
      // Hidden layer 2: Feature interactions
      tf.layers.dense({
        units: 16,
        activation: 'relu',
        kernelInitializer: 'heNormal'
      }),
      
      // Dropout for regularization (prevent overfitting)
      tf.layers.dropout({
        rate: 0.1
      }),
      
      // Output layer: Single value (risk score 0-100)
      tf.layers.dense({
        units: 1,
        activation: 'linear'
      })
    ]
  })

  // Compile model with optimizer and loss function
  newModel.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError',
    metrics: ['mae']
  })

  model = newModel
  return newModel
}

// Train the model with the dataset
export async function trainModel(
  onEpochEnd?: (epoch: number, loss: number) => void
): Promise<void> {
  if (!model) {
    await createModel()
  }

  // Convert training data to tensors
  const xs = tf.tensor2d(trainingData.inputs)
  const ys = tf.tensor2d(trainingData.outputs)

  console.log('Training fire risk prediction model...')

  // Train the model
  await model!.fit(xs, ys, {
    epochs: 100,
    batchSize: 4,
    shuffle: true,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onEpochEnd && logs) {
          onEpochEnd(epoch, logs.loss as number)
        }
        if (epoch % 20 === 0) {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}`)
        }
      }
    }
  })

  console.log('Model training complete!')

  // Clean up tensors
  xs.dispose()
  ys.dispose()
}

// Make prediction using the trained model
export async function predictRisk(
  temperature: number,
  humidity: number,
  rainfall: number,
  vegetation: number
): Promise<{
  riskScore: number
  confidence: number
  uncertainty: number
}> {
  if (!model) {
    throw new Error('Model not trained yet. Please train the model first.')
  }

  // Prepare input tensor
  const input = tf.tensor2d([[temperature, humidity, rainfall, vegetation]])

  // Make prediction
  const prediction = model.predict(input) as tf.Tensor

  // Get predicted value
  const predictedValue = await prediction.data()
  const riskScore = Math.round(Math.max(0, Math.min(100, predictedValue[0])))

  // Calculate confidence based on training data proximity
  // Higher confidence when input is similar to training data
  const distances = trainingData.inputs.map(trainInput => {
    const diff = [
      (temperature - trainInput[0]) / 50,
      (humidity - trainInput[1]) / 100,
      (rainfall - trainInput[2]) / 100,
      (vegetation - trainInput[3]) / 100
    ]
    return Math.sqrt(diff.reduce((sum, d) => sum + d * d, 0))
  })

  const minDistance = Math.min(...distances)
  const confidence = Math.round(Math.max(70, 95 - minDistance * 20))
  const uncertainty = Math.round((1 - confidence / 100) * 15)

  // Clean up tensors
  input.dispose()
  prediction.dispose()

  return {
    riskScore,
    confidence,
    uncertainty
  }
}

// Get model for inspection
export function getModel(): tf.LayersModel | null {
  return model
}

// Check if model is ready
export function isModelReady(): boolean {
  return model !== null
}