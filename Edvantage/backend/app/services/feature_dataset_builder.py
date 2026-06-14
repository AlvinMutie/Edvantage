from app.models.risk import InterventionOutcome, RiskPrediction, Intervention
from app.services.temporal_feature_service import temporal_feature_service
import pandas as pd
import numpy as np

class FeatureDatasetBuilder:
    def build_training_dataset(self):
        """
        Builds a training dataset from historical intervention outcomes.
        X: Features from student state BEFORE intervention.
        Y: Outcome improvement score.
        """
        outcomes = InterventionOutcome.query.all()
        if not outcomes:
            print("No outcomes found for training.")
            return None, None

        data_rows = []
        completeness_scores = []

        for outcome in outcomes:
            intervention = outcome.intervention
            if not intervention: continue
            
            # Find the prediction that triggered this intervention
            prediction = intervention.recommendation.prediction if intervention.recommendation else None
            if not prediction:
                # If no prediction link, we can't reliably get the "BEFORE" state 
                # unless we use the intervention creation date as reference
                ref_date = intervention.created_at
            else:
                ref_date = prediction.created_at

            # 1. Get X (Features BEFORE intervention)
            features = temporal_feature_service.get_student_features(intervention.student_id, ref_date)
            
            # Add Intervention Type as a categorical feature
            features['intervention_type'] = intervention.type
            
            # 2. Get Y (Outcome Score)
            # Use the effectiveness_score calculated during outcome recording
            score = outcome.effectiveness_score or 0.0
            
            # Convert continuous score to discrete risk labels for the classifier
            # High effectiveness (close to 1.0) means student is now LOW risk (0)
            if score > 0.8: label = 0 # Low
            elif score > 0.5: label = 1 # Medium
            elif score > 0.2: label = 2 # High
            else: label = 3 # Critical
            
            features['label'] = label
            features['trace_id'] = outcome.trace_id
            
            # Data Quality Check
            null_count = sum(1 for v in features.values() if v is None)
            completeness = (len(features) - null_count) / len(features)
            completeness_scores.append(completeness)
            
            data_rows.append(features)

        if not data_rows:
            return None, None

        df = pd.DataFrame(data_rows)
        
        # Log data completeness
        avg_completeness = np.mean(completeness_scores)
        print(f"Dataset completeness score: {avg_completeness:.2%}")
        
        if avg_completeness < 0.5:
            print("Warning: Low dataset completeness. Training may be unreliable.")

        # Handle missing data (explicitly as requested)
        df = df.fillna(0) # Fill missing trends/scores with 0
        
        # Split into X and Y
        X = df.drop(columns=['label', 'trace_id'])
        y = df['label']
        
        # Encode intervention_type
        X = pd.get_dummies(X, columns=['intervention_type'])
        
        return X, y

feature_dataset_builder = FeatureDatasetBuilder()
