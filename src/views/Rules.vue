<template>
  <div class="rules-page">
    <h2>Rules:</h2>
    <ol>
      <li>
        <p>You can earn points through the following activities:</p>
        <ul>
          <li>Submitting your LinkedIn: 50 points</li>
          <li>Submitting your CV: 300 points</li>
          <li>Job Fair: 50 points/company</li>
          <li>15/15: 300 points</li>
          <li>Eletrolink: 300 points</li>
          <li>Workshops: 500 points</li>
          <li>Inside Talks: 500 points</li>
          <!-- <li>Discussion Panel: 600 points</li> -->
          <li>KeyNote Speakers: 500 points</li>
        </ul>
      </li>
      <li>
        The points are only awarded if you stay for the whole period of the activity. Claiming the
        points and then leaving the activity will get you banned.
      </li>
      <li>
        To earn points for activities that are not performed in the app, you must use your QR Code.
      </li>
      <li>
        For the Job Fair activity, you must present the QR Code to the people in the booth. For
        other activities, you present it to the JEEC staff stationed at that activity.
      </li>
      <li>
        Points are divided into daily points and total points. Daily points are the points gained in
        the present day. Total points are all the points gained throughout the week, including the
        daily points.
      </li>
      <li>
        You can also create a squad to earn squad points. Squad points are only earned by their
        members while they are in the squad. If a member of the squad leaves it or gets banned, all
        points earned by that member are deleted from the squad. Squads can have up to 4 members.
      </li>
    </ol>

    <h2>Prizes:</h2>
    <ol>
      <li>
        Daily Draw: Earn daily points to get more chances of winning daily Draw! One winner
        every day.
      </li>
      <li>
        Weekly Individual Draw: At the end of the week, we'll draw 3 winners from the participants.
        The more points you have, the more chances you get to win!
      </li>
      <li>
        Weekly Squads Draw: Same rules, but for squads! Get your team to the top and win together.
      </li>
      <!-- <li>EletroLink Champion: The participant with the most EletroLinks wins.</li>
      <li>
        Job Fair Explorer: The one who visits the most booths during the fair takes the prize.
      </li> -->
      <li>CV Giveaway: Upload your CV to our platform and get a shot at winning a prize. Easy!</li>
      <li>Activity Prizes: One person is randomly selected at the end of each activity to win!</li>
    </ol>
  </div>
</template>

<style scoped>
.rules-page {
  padding: 0 2ch 0 4ch;
  padding-bottom: 130px;
  margin: 0 auto;
  max-width: 900px;
}

h2 {
  font-family: 'Lexend Exa';
  letter-spacing: 0.3ch;
  padding: 4rem 0 2rem 0;
  font-size: 2rem;
  text-align: center;
}

h2:first-of-type {
  padding-top: 2rem;
}

li,
p {
  font-family: 'Lexend Exa', sans-serif;
  color: var(--clr-dark-font);
  font-size: 1.1rem;
  line-height: 1.4;
}

li>p {
  padding-bottom: 0.5rem;
}

ol>li {
  padding-bottom: 0.6rem;
}

ul {
  padding-left: 2ch;
}

ul>li {
  padding-bottom: 0.5rem;
}
</style>
