# Этап 26: AI/ML Integration - Технические задания

## Задание 26.1: Машинное обучение для криптовалютной аналитики

### 🎯 Цель

Интегрировать системы машинного обучения для прогнозирования цен, обнаружения аномалий и персонализации

### 📋 Требования

#### Функциональные требования:

- [ ] Модель прогнозирования цен криптовалют
- [ ] Система обнаружения мошеннических транзакций
- [ ] Персонализация контента на основе поведения пользователей
- [ ] Автоматическое масштабирование ML инфраструктуры
- [ ] A/B тестирование ML моделей

#### ML Pipeline компоненты:

- [ ] **Сбор признаков**: Извлечение и инженерия признаков
- [ ] **Обучение моделей**: Автоматизированное обучение и валидация
- [ ] **Развертывание**: Бесшовное развертывание в продакшн
- [ ] **Мониторинг**: Отслеживание качества моделей
- [ ] **Версионирование**: Управление версиями моделей и экспериментов

### 💡 Подсказки

**ML Pipeline с MLflow и Apache Airflow:**

```python
# ml-platform/src/pipelines/crypto_price_prediction.py
import mlflow
import mlflow.sklearn
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

class CryptoPricePredictionPipeline:
    def __init__(self):
        self.experiment_name = "crypto_price_prediction"
        self.models = {
            'random_forest': RandomForestRegressor(random_state=42),
            'gradient_boosting': GradientBoostingRegressor(random_state=42),
        }
        self.scaler = StandardScaler()

    def setup_mlflow(self):
        """Настройка MLflow эксперимента"""
        mlflow.set_tracking_uri("http://localhost:5000")
        mlflow.set_experiment(self.experiment_name)

    def extract_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """Инженерия признаков для прогнозирования цен"""
        features = data.copy()

        # Технические индикаторы
        features['sma_7'] = features['price'].rolling(window=7).mean()
        features['sma_30'] = features['price'].rolling(window=30).mean()
        features['ema_12'] = features['price'].ewm(span=12).mean()
        features['ema_26'] = features['price'].ewm(span=26).mean()

        # MACD
        features['macd'] = features['ema_12'] - features['ema_26']
        features['macd_signal'] = features['macd'].ewm(span=9).mean()
        features['macd_histogram'] = features['macd'] - features['macd_signal']

        # RSI
        delta = features['price'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        features['rsi'] = 100 - (100 / (1 + rs))

        # Bollinger Bands
        features['bb_middle'] = features['price'].rolling(window=20).mean()
        bb_std = features['price'].rolling(window=20).std()
        features['bb_upper'] = features['bb_middle'] + (bb_std * 2)
        features['bb_lower'] = features['bb_middle'] - (bb_std * 2)
        features['bb_width'] = features['bb_upper'] - features['bb_lower']
        features['bb_position'] = (features['price'] - features['bb_lower']) / features['bb_width']

        # Волатильность
        features['volatility_7d'] = features['price'].rolling(window=7).std()
        features['volatility_30d'] = features['price'].rolling(window=30).std()

        # Объемные индикаторы
        features['volume_sma_7'] = features['volume'].rolling(window=7).mean()
        features['volume_ratio'] = features['volume'] / features['volume_sma_7']

        # Временные признаки
        features['hour'] = pd.to_datetime(features['timestamp']).dt.hour
        features['day_of_week'] = pd.to_datetime(features['timestamp']).dt.dayofweek
        features['month'] = pd.to_datetime(features['timestamp']).dt.month

        # Лаговые признаки
        for lag in [1, 3, 7, 24]:
            features[f'price_lag_{lag}'] = features['price'].shift(lag)
            features[f'volume_lag_{lag}'] = features['volume'].shift(lag)

        # Отношения цен
        features['price_change_1h'] = features['price'].pct_change(1)
        features['price_change_24h'] = features['price'].pct_change(24)
        features['price_change_7d'] = features['price'].pct_change(24*7)

        # Удаление NaN значений
        features = features.dropna()

        return features

    def prepare_target(self, data: pd.DataFrame, prediction_horizon: int = 1) -> pd.Series:
        """Подготовка целевой переменной для прогнозирования"""
        # Прогнозируем цену через prediction_horizon часов
        target = data['price'].shift(-prediction_horizon)
        return target.dropna()

    def train_model(self, X_train: pd.DataFrame, y_train: pd.Series, model_name: str):
        """Обучение модели с MLflow tracking"""
        with mlflow.start_run(run_name=f"{model_name}_training"):
            model = self.models[model_name]

            # Логирование параметров
            mlflow.log_params(model.get_params())

            # Обучение модели
            model.fit(X_train, y_train)

            # Прогнозы на обучающей выборке
            y_pred_train = model.predict(X_train)

            # Метрики
            train_mae = mean_absolute_error(y_train, y_pred_train)
            train_mse = mean_squared_error(y_train, y_pred_train)
            train_r2 = r2_score(y_train, y_pred_train)

            # Логирование метрик
            mlflow.log_metrics({
                'train_mae': train_mae,
                'train_mse': train_mse,
                'train_r2': train_r2,
            })

            # Важность признаков
            if hasattr(model, 'feature_importances_'):
                feature_importance = pd.DataFrame({
                    'feature': X_train.columns,
                    'importance': model.feature_importances_
                }).sort_values('importance', ascending=False)

                # Сохранение важности признаков как артефакт
                feature_importance.to_csv('feature_importance.csv', index=False)
                mlflow.log_artifact('feature_importance.csv')

            # Сохранение модели
            mlflow.sklearn.log_model(model, f"{model_name}_model")

            return model

    def hyperparameter_tuning(self, X_train: pd.DataFrame, y_train: pd.Series, model_name: str):
        """Подбор гиперпараметров с помощью GridSearchCV"""
        param_grids = {
            'random_forest': {
                'n_estimators': [100, 200, 300],
                'max_depth': [10, 20, None],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4]
            },
            'gradient_boosting': {
                'n_estimators': [100, 200, 300],
                'learning_rate': [0.01, 0.1, 0.2],
                'max_depth': [3, 5, 7],
                'subsample': [0.8, 0.9, 1.0]
            }
        }

        with mlflow.start_run(run_name=f"{model_name}_hyperparameter_tuning"):
            model = self.models[model_name]
            param_grid = param_grids[model_name]

            # Временное разделение для валидации
            tscv = TimeSeriesSplit(n_splits=5)

            # Grid Search
            grid_search = GridSearchCV(
                model, param_grid, cv=tscv,
                scoring='neg_mean_absolute_error',
                n_jobs=-1, verbose=1
            )

            grid_search.fit(X_train, y_train)

            # Логирование лучших параметров
            mlflow.log_params(grid_search.best_params_)
            mlflow.log_metric('best_cv_score', -grid_search.best_score_)

            return grid_search.best_estimator_

    def validate_model(self, model, X_test: pd.DataFrame, y_test: pd.Series):
        """Валидация модели на тестовых данных"""
        y_pred = model.predict(X_test)

        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        # Расчет точности прогноза направления изменения цены
        direction_accuracy = np.mean(
            (np.sign(y_pred - X_test['price_lag_1'].values) ==
             np.sign(y_test - X_test['price_lag_1'].values))
        )

        metrics = {
            'test_mae': mae,
            'test_mse': mse,
            'test_r2': r2,
            'direction_accuracy': direction_accuracy
        }

        return metrics, y_pred

    def run_pipeline(self, data_path: str, symbol: str):
        """Запуск полного ML pipeline"""
        self.setup_mlflow()

        # Загрузка данных
        data = pd.read_csv(data_path)
        data = data[data['symbol'] == symbol].copy()

        # Подготовка признаков
        features = self.extract_features(data)
        target = self.prepare_target(data, prediction_horizon=1)

        # Выравнивание данных
        min_len = min(len(features), len(target))
        X = features.iloc[:min_len]
        y = target.iloc[:min_len]

        # Разделение на обучающую и тестовую выборки (80/20)
        split_idx = int(0.8 * len(X))
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

        # Масштабирование признаков
        feature_columns = X_train.select_dtypes(include=[np.number]).columns
        X_train_scaled = X_train.copy()
        X_test_scaled = X_test.copy()

        X_train_scaled[feature_columns] = self.scaler.fit_transform(X_train[feature_columns])
        X_test_scaled[feature_columns] = self.scaler.transform(X_test[feature_columns])

        # Обучение и валидация моделей
        results = {}
        for model_name in self.models.keys():
            print(f"Обучение модели: {model_name}")

            # Подбор гиперпараметров
            best_model = self.hyperparameter_tuning(X_train_scaled, y_train, model_name)

            # Валидация
            metrics, predictions = self.validate_model(best_model, X_test_scaled, y_test)
            results[model_name] = {
                'model': best_model,
                'metrics': metrics,
                'predictions': predictions
            }

            print(f"Результаты {model_name}: MAE={metrics['test_mae']:.4f}, "
                  f"R²={metrics['test_r2']:.4f}, "
                  f"Точность направления={metrics['direction_accuracy']:.4f}")

        # Выбор лучшей модели
        best_model_name = min(results.keys(),
                            key=lambda x: results[x]['metrics']['test_mae'])

        print(f"Лучшая модель: {best_model_name}")
        return results[best_model_name]

# Запуск pipeline
if __name__ == "__main__":
    pipeline = CryptoPricePredictionPipeline()
    best_model = pipeline.run_pipeline("crypto_price_data.csv", "BTC")
```

**Система обнаружения аномалий:**

```typescript
// ml-platform/src/anomaly-detection/FraudDetectionService.ts
import * as tf from "@tensorflow/tfjs-node";
import { z } from "zod";

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  timestamp: number;
  fromAddress: string;
  toAddress: string;
  gasPrice: number;
  metadata: Record<string, any>;
}

export class FraudDetectionService {
  private model: tf.LayersModel | null = null;
  private scaler: { mean: number[]; std: number[] } | null = null;
  private featureNames: string[] = [];

  async loadModel(modelPath: string): Promise<void> {
    this.model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log("Модель обнаружения мошенничества загружена");
  }

  extractFeatures(
    transaction: Transaction,
    userHistory: Transaction[]
  ): number[] {
    const features: Record<string, number> = {};

    // Основные признаки транзакции
    features.amount = transaction.amount;
    features.gas_price = transaction.gasPrice;
    features.hour_of_day = new Date(transaction.timestamp).getHours();
    features.day_of_week = new Date(transaction.timestamp).getDay();

    // Статистики пользователя
    if (userHistory.length > 0) {
      const amounts = userHistory.map((t) => t.amount);
      const timestamps = userHistory.map((t) => t.timestamp);

      features.user_avg_amount =
        amounts.reduce((a, b) => a + b, 0) / amounts.length;
      features.user_max_amount = Math.max(...amounts);
      features.user_std_amount = this.standardDeviation(amounts);
      features.user_transaction_frequency =
        userHistory.length /
        Math.max(
          1,
          (Math.max(...timestamps) - Math.min(...timestamps)) /
            (24 * 60 * 60 * 1000)
        );

      // Отклонение от обычного поведения
      features.amount_deviation =
        Math.abs(transaction.amount - features.user_avg_amount) /
        Math.max(1, features.user_std_amount);

      // Время с последней транзакции
      const lastTransaction = Math.max(...timestamps);
      features.time_since_last =
        (transaction.timestamp - lastTransaction) / (60 * 60 * 1000); // часы
    } else {
      // Новый пользователь
      features.user_avg_amount = 0;
      features.user_max_amount = 0;
      features.user_std_amount = 0;
      features.user_transaction_frequency = 0;
      features.amount_deviation = 0;
      features.time_since_last = 0;
      features.is_new_user = 1;
    }

    // Сетевые признаки
    features.address_reuse = userHistory.filter(
      (t) => t.toAddress === transaction.toAddress
    ).length;

    // Временные паттерны
    const recentTransactions = userHistory.filter(
      (t) => transaction.timestamp - t.timestamp < 24 * 60 * 60 * 1000
    );
    features.transactions_last_24h = recentTransactions.length;
    features.volume_last_24h = recentTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // Преобразование в массив
    this.featureNames = Object.keys(features);
    return Object.values(features);
  }

  async predict(
    transaction: Transaction,
    userHistory: Transaction[]
  ): Promise<{
    fraud_probability: number;
    risk_level: "low" | "medium" | "high";
    explanation: string[];
  }> {
    if (!this.model) {
      throw new Error("Модель не загружена");
    }

    const features = this.extractFeatures(transaction, userHistory);

    // Нормализация признаков
    const normalizedFeatures = this.normalizeFeatures(features);

    // Предсказание
    const input = tf.tensor2d([normalizedFeatures]);
    const prediction = this.model.predict(input) as tf.Tensor;
    const fraudProbability = await prediction.data();

    // Очистка тензоров
    input.dispose();
    prediction.dispose();

    const probability = fraudProbability[0];

    // Определение уровня риска
    let riskLevel: "low" | "medium" | "high" = "low";
    if (probability > 0.8) riskLevel = "high";
    else if (probability > 0.5) riskLevel = "medium";

    // Объяснение предсказания
    const explanation = this.explainPrediction(features, probability);

    return {
      fraud_probability: probability,
      risk_level: riskLevel,
      explanation,
    };
  }

  private normalizeFeatures(features: number[]): number[] {
    if (!this.scaler) {
      // В продакшн загружать сохраненные параметры нормализации
      return features;
    }

    return features.map((value, index) => {
      const mean = this.scaler!.mean[index] || 0;
      const std = this.scaler!.std[index] || 1;
      return (value - mean) / std;
    });
  }

  private explainPrediction(features: number[], probability: number): string[] {
    const explanations: string[] = [];

    // Анализ основных индикаторов риска
    if (features[this.featureNames.indexOf("amount_deviation")] > 3) {
      explanations.push(
        "Сумма транзакции значительно отличается от обычной активности пользователя"
      );
    }

    if (features[this.featureNames.indexOf("transactions_last_24h")] > 10) {
      explanations.push(
        "Необычно высокая частота транзакций за последние 24 часа"
      );
    }

    if (features[this.featureNames.indexOf("is_new_user")] === 1) {
      explanations.push("Новый пользователь без истории транзакций");
    }

    const hourOfDay = features[this.featureNames.indexOf("hour_of_day")];
    if (hourOfDay < 6 || hourOfDay > 22) {
      explanations.push("Транзакция в необычное время суток");
    }

    if (probability > 0.8) {
      explanations.push("Высокая вероятность мошеннической активности");
    } else if (probability > 0.5) {
      explanations.push("Умеренный риск мошенничества");
    }

    return explanations;
  }

  private standardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  }

  async batchPredict(transactions: Transaction[]): Promise<Map<string, any>> {
    const results = new Map();

    for (const transaction of transactions) {
      // В реальном приложении здесь был бы асинхронный запрос истории пользователя
      const userHistory: Transaction[] = [];

      try {
        const prediction = await this.predict(transaction, userHistory);
        results.set(transaction.id, prediction);
      } catch (error) {
        console.error(
          `Ошибка предсказания для транзакции ${transaction.id}:`,
          error
        );
        results.set(transaction.id, { error: error.message });
      }
    }

    return results;
  }
}
```

### ❓ Вопросы для изучения

1. **Feature Engineering**: Какие признаки наиболее важны для прогнозирования цен криптовалют?
2. **Model Selection**: Когда использовать глубокое обучение vs традиционные ML алгоритмы?
3. **Real-time Inference**: Как обеспечить низкую задержку для ML предсказаний в продакшн?
4. **Model Monitoring**: Как отслеживать деградацию качества моделей?

---

## Задание 26.2: MLOps инфраструктура

### 🎯 Цель

Построить end-to-end MLOps платформу для автоматизации жизненного цикла ML моделей

### 📋 Требования

#### Функциональные требования:

- [ ] Автоматизированные пайплайны обучения моделей
- [ ] Система версионирования моделей и данных
- [ ] A/B тестирование ML моделей
- [ ] Мониторинг производительности моделей
- [ ] Автоматическое переобучение при деградации качества

### 💡 Подсказки

**Kubeflow Pipeline для автоматизации ML:**

```python
# mlops/pipelines/training_pipeline.py
import kfp
from kfp import dsl
from kfp.v2 import compiler
from kfp.v2.dsl import component, pipeline, Input, Output, Dataset, Model

@component(
    base_image="python:3.9",
    packages_to_install=["pandas", "scikit-learn", "mlflow"]
)
def data_preprocessing(
    input_data: Input[Dataset],
    processed_data: Output[Dataset],
    feature_store_uri: str
):
    """Компонент предобработки данных"""
    import pandas as pd
    import mlflow

    # Загрузка данных
    df = pd.read_csv(input_data.path)

    # Предобработка
    # ... логика предобработки ...

    # Сохранение обработанных данных
    df.to_csv(processed_data.path, index=False)

    # Логирование в MLflow
    mlflow.log_artifacts(processed_data.path)

@component(
    base_image="python:3.9",
    packages_to_install=["scikit-learn", "mlflow", "joblib"]
)
def model_training(
    training_data: Input[Dataset],
    model_artifact: Output[Model],
    hyperparameters: dict
):
    """Компонент обучения модели"""
    import pandas as pd
    import mlflow
    import joblib
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.metrics import mean_absolute_error

    # Загрузка данных
    df = pd.read_csv(training_data.path)
    X = df.drop(['target'], axis=1)
    y = df['target']

    # Обучение модели
    model = RandomForestRegressor(**hyperparameters)
    model.fit(X, y)

    # Валидация
    predictions = model.predict(X)
    mae = mean_absolute_error(y, predictions)

    # Сохранение модели
    joblib.dump(model, model_artifact.path)

    # Логирование в MLflow
    with mlflow.start_run():
        mlflow.log_params(hyperparameters)
        mlflow.log_metric("mae", mae)
        mlflow.sklearn.log_model(model, "model")

@component(
    base_image="python:3.9",
    packages_to_install=["scikit-learn", "joblib"]
)
def model_evaluation(
    model_artifact: Input[Model],
    test_data: Input[Dataset],
    evaluation_metrics: Output[Dataset],
    accuracy_threshold: float = 0.8
):
    """Компонент оценки модели"""
    import pandas as pd
    import joblib
    from sklearn.metrics import mean_absolute_error, r2_score

    # Загрузка модели и данных
    model = joblib.load(model_artifact.path)
    test_df = pd.read_csv(test_data.path)

    X_test = test_df.drop(['target'], axis=1)
    y_test = test_df['target']

    # Предсказания
    predictions = model.predict(X_test)

    # Метрики
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    # Проверка качества
    model_approved = r2 >= accuracy_threshold

    # Сохранение результатов
    metrics = {
        'mae': mae,
        'r2': r2,
        'approved': model_approved
    }

    pd.DataFrame([metrics]).to_csv(evaluation_metrics.path, index=False)

@pipeline(
    name="crypto-price-prediction-pipeline",
    description="Пайплайн для обучения модели прогнозирования цен криптовалют"
)
def training_pipeline(
    data_source: str,
    hyperparameters: dict = {"n_estimators": 100, "max_depth": 10},
    accuracy_threshold: float = 0.8
):
    """Основной пайплайн обучения"""

    # Предобработка данных
    preprocess_task = data_preprocessing(
        input_data=data_source,
        feature_store_uri="s3://crypto-feature-store"
    )

    # Обучение модели
    training_task = model_training(
        training_data=preprocess_task.outputs['processed_data'],
        hyperparameters=hyperparameters
    )

    # Оценка модели
    evaluation_task = model_evaluation(
        model_artifact=training_task.outputs['model_artifact'],
        test_data=preprocess_task.outputs['processed_data'],
        accuracy_threshold=accuracy_threshold
    )

    return evaluation_task

# Компиляция пайплайна
if __name__ == "__main__":
    compiler.Compiler().compile(
        pipeline_func=training_pipeline,
        package_path="crypto_training_pipeline.yaml"
    )
```

### 🔍 Критерии оценки

- [ ] **ML Pipeline** (40): Автоматизация обучения и развертывания
- [ ] **Feature Engineering** (30): Качество признаков и их важность
- [ ] **Model Performance** (20): Точность и стабильность моделей
- [ ] **MLOps Infrastructure** (10): Версионирование, мониторинг, A/B тесты

---

## 📊 Общая оценка этапа 26

| Критерий                  | Баллы   | Описание                              |
| ------------------------- | ------- | ------------------------------------- |
| **ML модели**             | 60      | Качество и производительность моделей |
| **Feature Engineering**   | 40      | Инженерия признаков                   |
| **MLOps инфраструктура**  | 30      | Автоматизация ML pipeline             |
| **Production Deployment** | 30      | Развертывание и мониторинг в продакшн |
| **Итого**                 | **160** | Минимум 112 для перехода к этапу 27   |

### 🎯 Следующий этап

После завершения этапа 26 переходим к **Этапу 27: Research & Innovation**.
