from django.core.exceptions import ValidationError
import os
import requests
import json
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)
from openai import OpenAI



client = OpenAI(
  api_key = os.environ.get("OPENAI_API_KEY"),
)




sentry_api_key = os.environ.get("SENTRY_API_KEY")

def get_sentry():
    try:
        response = requests.get(f'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={sentry_api_key}')
        response.raise_for_status()
        data = response.json()
        return Response(data, status=HTTP_200_OK)
    except ValidationError as e:
        print(e)
        return Response(e, status=HTTP_400_BAD_REQUEST)
    


def get_quiz():
  try:

    response = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=[
        {"role": "system", "content": "You are a science teacher."},
        {"role": "user", "content": ('''Use this information:[Early Detection and Monitoring
  Space-Based Telescopes: Deploying telescopes in space to continuously monitor the sky for Near-Earth Objects (NEOs). Examples include NASA’s NEOWISE mission and the upcoming NEOCam.
  Ground-Based Telescopes: Utilizing a network of observatories around the world to detect and track asteroids. Projects like the Pan-STARRS and the Catalina Sky Survey are part of this effort.
  Data Sharing and Coordination: International collaboration through organizations like the International Asteroid Warning Network (IAWN) and the Space Mission Planning Advisory Group (SMPAG) to share data and coordinate responses.
  Deflection Techniques
  Kinetic Impactor: This involves sending a spacecraft to collide with the asteroid at high speed, changing its trajectory. NASA’s Double Asteroid Redirection Test (DART) mission is an example, scheduled to test this method on the moonlet of the asteroid Didymos.
  Gravity Tractor: A spacecraft would fly alongside the asteroid for an extended period, using its gravitational pull to gradually alter the asteroid’s path.
  Ion Beam Shepherd: This concept involves using ion thrusters to create a continuous stream of particles that push against the asteroid, slowly changing its trajectory over time.
  Disruption Techniques
  Nuclear Explosions: A nuclear device could be detonated near or on the asteroid to either vaporize a portion of it or to alter its course significantly. This is considered a last resort due to the potential for fragmenting the asteroid into multiple pieces, which might still pose a threat.
  Laser Ablation: Using high-powered lasers to vaporize the surface of the asteroid, creating jets of gas that would act as a propulsion mechanism to nudge the asteroid off course.
  Civil Protection and Mitigation
  Impact Prediction and Modeling: Improved computer models to predict impact locations, potential damage, and secondary effects like tsunamis and atmospheric changes.
  Evacuation Plans: Developing and rehearsing evacuation plans for regions identified as potential impact sites.
  Global Response Coordination: Establishing international protocols for disaster response, resource distribution, and public communication.
  General Effects on Human Civilization
  Economic Disruption: Severe damage to infrastructure, agriculture, and resources can lead to economic collapse in affected regions.
  Human Casualties: Direct impact areas would suffer heavy casualties, with potential global consequences from secondary effects like famine and disease.
  Global Cooperation and Response: Such an event would likely necessitate global cooperation for disaster response, food distribution, and potentially relocation of populations.
  International Collaboration and Policy Development
  Space Treaties and Agreements: Strengthening international treaties and agreements to ensure cooperation and shared responsibility in asteroid detection and deflection efforts.
  Funding and Research: Increasing funding for asteroid research, detection programs, and the development of deflection technologies.
  Key Missions and Programs
  NASA’s Planetary Defense Coordination Office (PDCO): Coordinates efforts to detect, track, and characterize potentially hazardous asteroids and comets.
  ESA’s Hera Mission: A follow-up to NASA’s DART mission, Hera will study the aftermath of the DART impact to gather critical data on the effectiveness of kinetic impactors.
  Space Situational Awareness (SSA) Program: Run by the European Space Agency (ESA) to detect and track objects that pose a risk to Earth or to satellites in orbit.
  Challenges and Considerations
  Timely Detection: Early detection is crucial, as deflection methods are more effective when applied well in advance of a potential impact.
  Technological Development: Many of the proposed deflection techniques are still in the research or testing phase and require further development.
  International Cooperation: Effective planetary defense requires global collaboration, as the impact of a large asteroid would have worldwide consequences.Small Meteors (up to 25 meters in diameter)
  Atmospheric Entry: These meteors typically burn up upon entering the Earth’s atmosphere, causing a bright flash and potentially a sonic boom.
  Damage: If fragments reach the ground, they may cause minor damage locally, such as breaking windows or small craters. An example is the Chelyabinsk meteor in 2013, which caused injuries mainly from broken glass.
  Medium Meteors (25 meters to 1 kilometer in diameter)
  Local Destruction: A meteor in this size range can cause significant local destruction, including fires, shockwaves, and substantial craters.
  Tsunamis: If it impacts an ocean, it can generate large tsunamis capable of affecting coastal areas over a wide region.
  Climate Effects: Dust and debris thrown into the atmosphere can lead to short-term climate changes, such as “impact winter,” where sunlight is blocked, leading to global cooling and agricultural impacts.
  Large Meteors (1 kilometer to 10 kilometers in diameter)
  Regional to Global Catastrophe: These impacts can cause massive destruction over hundreds of kilometers from the impact site. The blast, heat, and shockwave can annihilate life forms in the vicinity.
  Tsunamis: If the impact occurs in the ocean, it would generate massive tsunamis with potentially devastating global effects on coastal regions.
  Climate Disruption: The impact would throw vast amounts of dust, ash, and aerosols into the atmosphere, potentially causing global cooling for years. This can disrupt ecosystems, agriculture, and food supplies globally.
  Extinctions: Such an event can lead to mass extinctions due to the combination of immediate destruction, climatic effects, and ecological collapse. The most well-known example is the Chicxulub impactor, which contributed to the extinction of the dinosaurs 66 million years ago.
  Very Large Meteors (over 10 kilometers in diameter)
  Global Catastrophe: These are extremely rare but can cause near-instantaneous global devastation.
  Immediate Effects: Massive firestorms, shockwaves, and tsunamis would affect the entire planet.
  Long-term Effects: Severe climate changes, including extended “impact winters,” leading to mass extinctions and potentially the collapse of human civilization.
  General Effects on Human Civilization
  Economic Disruption: Severe damage to infrastructure, agriculture, and resources can lead to economic collapse in affected regions.
  Human Casualties: Direct impact areas would suffer heavy casualties, with potential global consequences from secondary effects like famine and disease.
  Global Cooperation and Response: Such an event would likely necessitate global cooperation for disaster response, food distribution, and potentially relocation of populations.Close Approaches
  How close?
  A body in space is considered a near-earth object if passing within 1.3 times the distance from the Earth to the Sun (defined as 1 astronomical unit, AU). For reference, the Earth is 93 million miles from the Sun (150 million km), and the moon is 238,900 miles (384,000 km) from Earth.
  What's the issue?
  Collision with the earth can have significant effects on the environment, ranging from local effects to global impact.
  A potential hazardous asteroid (PHA) would approach closer than 0.05 AU and a diameter of greater than 500 ft (140m).
  How often?
  Since 1900, NASA has logged 2,586 PHAs and anticipate 3,317 more out to 2200 AD.
  Examples
  In 1957, 2019 CD2 asteroid passed 46,349 mi from Earth, with a diameter of 850-1940 ft. This is relatively large, and with this asteroid's orbit around the sun it will have at least 5 more close approaches in the future (although not as close).
  In 2029, 99942 Apophis, an asteroid of around 1,115 ft in diameter, will pass 23,619 mi from the Earth.
  The near-earth object everyone recognizes is Halley's Comet. With observations going back 2,000 years, the comet approaches the earth every 76 years. The comet is large, being about 48,000 ft by 26,000 ft. Thankfully the closest approach has been 0.033 AU (3 million miles), in 837 AD.] Make Ten multiple choice questions using this information. Return these in JSON format, use this example:{"question":the random question,"choice one":random choice,"choice two":random choice,"choice three":random choice,"choice four":random choice,"answer":correct answer}One of these choices will be the correct answer.''') },
      ]
    )

    quiz = response.choices[0].message.content

    data = json.loads(quiz)
    print(data)

    return Response(data, status=HTTP_201_CREATED)
  except ValidationError as e:
    print(e)
    return Response(e, status=HTTP_400_BAD_REQUEST)

# ask_question()


